import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ||
  '116725935826-sp443kuth9cf77dnmboqtu1dvafi8lt0.apps.googleusercontent.com';

// GET — Initiate Google OAuth DIRECTLY (not via Supabase)
// Makes Google show "Sign in to dagarmy.network" instead of Supabase domain
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get('redirect') || '/student-dashboard';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const state = Buffer.from(JSON.stringify({ next, ts: Date.now() })).toString('base64url');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${appUrl}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  // 🔍 TEMP DEBUG — remove after confirming
  console.log('[Google OAuth] client_id   :', GOOGLE_CLIENT_ID);
  console.log('[Google OAuth] redirect_uri:', `${appUrl}/api/auth/google/callback`);
  console.log('[Google OAuth] full URL    :', authUrl);

  return NextResponse.redirect(authUrl);

}
