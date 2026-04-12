import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SignJWT } from 'jose';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ||
  '116725935826-sp443kuth9cf77dnmboqtu1dvafi8lt0.apps.googleusercontent.com';

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = new TextEncoder().encode(process.env.DAG_JWT_SECRET!);

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Derive the canonical app origin from the incoming request.
 * This MUST match the redirect_uri sent in the initial /api/auth/google request.
 * Using the actual request URL avoids env-var / www vs non-www mismatches.
 */
function getAppUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

// GET — Google sends user back here with ?code=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Derive appUrl from the actual request so redirect_uri always matches
  const appUrl = getAppUrl(req);

  if (error || !code) {
    return NextResponse.redirect(
      `${appUrl}/?google_error=cancelled&reason=${encodeURIComponent(error || 'no_code')}`
    );
  }

  // Guard: client secret must be set
  if (!GOOGLE_CLIENT_SECRET) {
    console.error('[Google callback] GOOGLE_CLIENT_SECRET env var is NOT set in Vercel!');
    return NextResponse.redirect(
      `${appUrl}/?google_error=server_config&reason=missing_client_secret`
    );
  }

  // Decode redirect target from state
  let next = '/student-dashboard';
  try {
    if (state) {
      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
      next = decoded.next || next;
    }
  } catch {}

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  console.log('[Google callback] appUrl     :', appUrl);
  console.log('[Google callback] redirectUri:', redirectUri);

  try {
    // 1. Exchange authorization code for tokens
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

    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.access_token) {
      console.error('[Google callback] Token exchange FAILED. Status:', tokenRes.status);
      console.error('[Google callback] Google response:', JSON.stringify(tokens));
      const reason = encodeURIComponent(
        tokens.error_description || tokens.error || 'unknown'
      );
      return NextResponse.redirect(
        `${appUrl}/?google_error=token_failed&reason=${reason}`
      );
    }

    // 2. Get user profile from Google
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profile.email) {
      return NextResponse.redirect(`${appUrl}/?google_error=no_email`);
    }

    const supabase = getSupabase();
    const normalizedEmail = profile.email.toLowerCase().trim();

    // 3. Find or create user in our users table
    let { data: user } = await supabase
      .from('users')
      .select('id, email, full_name, role, is_admin, is_master_admin, auth_provider, email_verified, avatar_url, is_active, wallet_address, platform_last_login')
      .eq('email', normalizedEmail)
      .single() as { data: any };

    if (!user) {
      // New user — create with Google as auth provider
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: normalizedEmail,
          full_name: profile.name || profile.given_name || '',
          avatar_url: profile.picture || null,
          auth_provider: 'google',
          email_verified: true,
          role: 'student',
          is_active: true,
        })
        .select('id, email, full_name, role, is_admin, is_master_admin, auth_provider, email_verified, avatar_url, is_active, wallet_address')
        .single();

      if (createError || !newUser) {
        console.error('[Google callback] User create failed:', createError);
        return NextResponse.redirect(`${appUrl}/?google_error=db_failed`);
      }
      user = newUser;
    } else if (user.auth_provider === 'wallet') {
      await supabase.from('users').update({
        auth_provider: 'google',
        full_name: user.full_name || profile.name,
        avatar_url: profile.picture || null,
        email_verified: true,
      }).eq('id', user.id);
    } else {
      // Update last login and avatar for returning users
      await supabase.from('users').update({
        avatar_url: profile.picture || user.avatar_url,
        platform_last_login: {
          ...(user.platform_last_login || {}),
          dagarmy: new Date().toISOString(),
        },
      }).eq('id', user.id);
    }

    // 4. Issue our platform JWT — full payload shape matching email login
    const token = await new SignJWT({
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

    // 5. Build safe user object — same shape as email login response
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

    // 6. Redirect to set-session — passes token + user for localStorage hydration
    const setSessionUrl = new URL(
      `/api/auth/google/set-session?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(safeUser))}&next=${encodeURIComponent(next)}`,
      appUrl
    );
    const response = NextResponse.redirect(setSessionUrl);

    response.cookies.set('dagarmy_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('[Google callback] Unexpected error:', err);
    return NextResponse.redirect(`${appUrl}/?google_error=unknown`);
  }
}
