import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ||
  '116725935826-sp443kuth9cf77dnmboqtu1dvafi8lt0.apps.googleusercontent.com';

/**
 * GET /api/auth/google
 * Initiates Google OAuth — derives the redirect_uri from the actual request origin
 * so it always matches whatever the callback route will see.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get('redirect') || '/student-dashboard';
  const ref  = searchParams.get('ref') || null;

  // Derive app URL from the request itself — avoids www vs non-www mismatch
  const reqUrl = new URL(req.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    || `${reqUrl.protocol}//${reqUrl.host}`;

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  const state = Buffer.from(JSON.stringify({ next, ref, ts: Date.now() })).toString('base64url');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  console.log('[Google OAuth] appUrl      :', appUrl);
  console.log('[Google OAuth] redirect_uri:', redirectUri);
  console.log('[Google OAuth] full URL    :', authUrl);

  return NextResponse.redirect(authUrl);
}
