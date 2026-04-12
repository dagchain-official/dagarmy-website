import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SignJWT } from 'jose';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ||
  '116725935826-sp443kuth9cf77dnmboqtu1dvafi8lt0.apps.googleusercontent.com';

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const JWT_SECRET = new TextEncoder().encode(process.env.DAG_JWT_SECRET!);

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET — Google sends user back here with ?code=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dagarmy.network';

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/?google_error=cancelled`);
  }

  // Decode redirect target from state
  let next = '/student-dashboard';
  try {
    if (state) {
      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
      next = decoded.next || next;
    }
  } catch {}

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.access_token) {
      console.error('[Google callback] Token exchange failed:', tokens);
      return NextResponse.redirect(`${appUrl}/?google_error=token_failed`);
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
      .select('id, email, full_name, role, auth_provider, email_verified, avatar_url')
      .eq('email', normalizedEmail)
      .single() as { data: { id: string; email: string; full_name: string; role: string; auth_provider: string; email_verified: boolean; avatar_url: string | null } | null };

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
        })
        .select('id, email, full_name, role, auth_provider, email_verified, avatar_url')
        .single();

      if (createError || !newUser) {
        console.error('[Google callback] User create failed:', createError);
        return NextResponse.redirect(`${appUrl}/?google_error=db_failed`);
      }
      user = newUser;
    } else if (user.auth_provider === 'wallet') {
      // Existing wallet-only user — link Google to their account
      await supabase.from('users').update({
        auth_provider: 'google',
        full_name: user.full_name || profile.name,
        avatar_url: profile.picture || null,
        email_verified: true,
      }).eq('id', user.id);
    }

    // 4. Issue our platform JWT
    if (!user) {
      return NextResponse.redirect(`${appUrl}/?google_error=user_not_found`);
    }

    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role || 'student',
      provider: 'google',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // 5. Redirect to set-session (sets localStorage) with cookie attached
    const setSessionUrl = new URL(
      `/api/auth/google/set-session?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`,
      appUrl
    );
    const response = NextResponse.redirect(setSessionUrl);

    // Set cookie on THIS response (not a discarded one)
    // httpOnly: false so AuthContext can also read from document.cookie if needed
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
