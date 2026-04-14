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

  // Always derive from request host — must match callback/route.ts exactly.
  // NEVER use NEXT_PUBLIC_APP_URL here as it may be http://localhost:3000 in prod.
  const reqUrl = new URL(req.url);
  const appUrl = `${reqUrl.protocol}//${reqUrl.host}`;

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  const state = Buffer.from(JSON.stringify({ next, ts: Date.now() })).toString('base64url');

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
