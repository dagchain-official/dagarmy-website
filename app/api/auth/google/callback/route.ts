import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SignJWT } from 'jose';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ||
  '116725935826-sp443kuth9cf77dnmboqtu1dvafi8lt0.apps.googleusercontent.com';

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

function getJwtSecret() {
  const s = process.env.DAG_JWT_SECRET;
  if (!s) throw new Error('DAG_JWT_SECRET is not set');
  return new TextEncoder().encode(s);
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(url, key);
}

function getAppUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

function redirectError(appUrl: string, code: string, detail?: string) {
  const reason = detail ? `&reason=${encodeURIComponent(detail)}` : '';
  return NextResponse.redirect(`${appUrl}/?google_error=${code}${reason}`);
}

// GET — Google sends user back here with ?code=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const appUrl = getAppUrl(req);

  console.log('[Google callback] appUrl:', appUrl);
  console.log('[Google callback] code present:', !!code);

  if (error || !code) {
    return redirectError(appUrl, 'cancelled', error || 'no_code');
  }

  if (!GOOGLE_CLIENT_SECRET) {
    console.error('[Google callback] STEP 0 FAIL: GOOGLE_CLIENT_SECRET not set');
    return redirectError(appUrl, 'server_config', 'missing_client_secret');
  }

  // Check other required env vars early
  const missingVars = [];
  if (!process.env.DAG_JWT_SECRET) missingVars.push('DAG_JWT_SECRET');
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  if (missingVars.length > 0) {
    console.error('[Google callback] STEP 0 FAIL: Missing env vars:', missingVars.join(', '));
    return redirectError(appUrl, 'server_config', `missing:${missingVars.join(',')}`);
  }

  let next = '/student-dashboard';
  let ref: string | null = null;
  try {
    if (state) {
      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
      next = decoded.next || next;
      ref  = decoded.ref || null;
    }
  } catch {}

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  console.log('[Google callback] redirectUri:', redirectUri);

  // ── STEP 1: Exchange authorization code for Google tokens ──────────────────
  let tokens: any;
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.access_token) {
      const detail = tokens.error_description || tokens.error || `http_${tokenRes.status}`;
      console.error('[Google callback] STEP 1 FAIL: Token exchange failed:', tokens);
      return redirectError(appUrl, 'token_failed', detail);
    }
    console.log('[Google callback] STEP 1 OK: Token exchange succeeded');
  } catch (err: any) {
    console.error('[Google callback] STEP 1 EXCEPTION:', err.message);
    return redirectError(appUrl, 'step1_exception', err.message);
  }

  // ── STEP 2: Get Google profile ─────────────────────────────────────────────
  let profile: any;
  try {
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    profile = await profileRes.json();
    if (!profile.email) {
      console.error('[Google callback] STEP 2 FAIL: No email in profile:', profile);
      return redirectError(appUrl, 'no_email');
    }
    console.log('[Google callback] STEP 2 OK: Got profile for', profile.email);
  } catch (err: any) {
    console.error('[Google callback] STEP 2 EXCEPTION:', err.message);
    return redirectError(appUrl, 'step2_exception', err.message);
  }

  // ── STEP 3: Find or create user in Supabase ────────────────────────────────
  let user: any;
  let existingUser: any;
  try {
    const supabase = getSupabase();
    const normalizedEmail = profile.email.toLowerCase().trim();

    const { data: existingUserData } = await supabase
      .from('users')
      .select('id, email, full_name, role, is_admin, is_master_admin, auth_provider, email_verified, avatar_url, is_active, wallet_address, platform_last_login')
      .eq('email', normalizedEmail)
      .single();
    existingUser = existingUserData;

    if (!existingUser) {
      console.log('[Google callback] STEP 3: Creating new user for', normalizedEmail);
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: normalizedEmail,
          full_name: profile.name || profile.given_name || '',
          avatar_url: profile.picture || null,
          auth_provider: 'google',
          email_verified: true,
          profile_completed: false,  // New Google users must complete WhatsApp + name
          role: 'student',
          is_active: true,
        })
        .select('id, email, full_name, role, is_admin, is_master_admin, auth_provider, email_verified, avatar_url, is_active, wallet_address, profile_completed')
        .single();

      if (createError || !newUser) {
        console.error('[Google callback] STEP 3 FAIL: Could not create user:', createError);
        return redirectError(appUrl, 'db_failed', createError?.message || 'insert_failed');
      }
      user = newUser;
      // ── Track referral if a ref code was passed ─────────────────────────────
      if (ref) {
        const supabase2 = getSupabase();
        const { data: referrer } = await supabase2.from('users').select('id').eq('referral_code', ref.toUpperCase()).single();
        if (referrer && referrer.id !== newUser.id) {
          await supabase2.from('referrals').insert({
            referrer_id: referrer.id,
            referred_id: newUser.id,
            referral_code: ref.toUpperCase(),
            status: 'pending',
          });
          await supabase2.from('users').update({ referred_by_user_id: referrer.id }).eq('id', newUser.id);
        }
      }
      // ── Notify DAGChain of brand-new Google sign-up (fire-and-forget) ──────
      import('@/services/dagchainWebhook').then(({ notifyUserCreated }) => {
        notifyUserCreated({
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          auth_provider: 'google',
          referral_code_used: ref || null,
        });
      }).catch(() => {});
    } else {
      user = existingUser;
      // Update last login + avatar + ensure profile_completed is set
      // (fixes users who logged in via Google before this field was populated)
      await supabase.from('users').update({
        avatar_url: profile.picture || user.avatar_url,
        auth_provider: user.auth_provider === 'wallet' ? 'google' : user.auth_provider,
        profile_completed: true,   // ensure existing Google users are never stuck on redirect loop
        platform_last_login: {
          ...(user.platform_last_login || {}),
          dagarmy: new Date().toISOString(),
        },
      }).eq('id', user.id);
    }
    console.log('[Google callback] STEP 3 OK: User resolved, id:', user.id);
  } catch (err: any) {
    console.error('[Google callback] STEP 3 EXCEPTION:', err.message);
    return redirectError(appUrl, 'step3_exception', err.message);
  }

  // ── STEP 4: Issue JWT ──────────────────────────────────────────────────────
  let token: string;
  try {
    const JWT_SECRET = getJwtSecret();
    token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role || 'student',
      isAdmin: user.is_admin || false,
      isMasterAdmin: user.is_master_admin || false,
      platform: 'dagarmy',
      provider: 'google',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);
    console.log('[Google callback] STEP 4 OK: JWT issued');
  } catch (err: any) {
    console.error('[Google callback] STEP 4 EXCEPTION:', err.message);
    return redirectError(appUrl, 'step4_exception', err.message);
  }

  // ── STEP 5: Redirect to set-session ───────────────────────────────────────
  const isNewGoogleUser = !existingUser;
  const safeUser = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role || 'student',
    avatar_url: user.avatar_url,
    is_admin: user.is_admin || false,
    is_master_admin: user.is_master_admin || false,
    wallet_address: user.wallet_address || null,
    profile_completed: user.profile_completed || false,
  };

  // New Google users OR returning users missing WhatsApp → profile completion
  const needsProfile = isNewGoogleUser || !existingUser?.whatsapp_number || !existingUser?.first_name || !existingUser?.last_name;
  const finalNext = needsProfile ? `/complete-profile?email=${encodeURIComponent(user.email)}` : next;

  const setSessionUrl = new URL(
    `/api/auth/google/set-session?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(safeUser))}&next=${encodeURIComponent(finalNext)}`,
    appUrl
  );

  console.log('[Google callback] STEP 5: Redirecting to set-session, destination:', next);

  const response = NextResponse.redirect(setSessionUrl);
  response.cookies.set('dagarmy_token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
