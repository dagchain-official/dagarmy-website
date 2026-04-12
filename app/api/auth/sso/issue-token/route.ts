import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyPlatformJWT, extractBearerToken, signSSOToken, logSSOSession, buildSSORedirectUrl } from '@/lib/dagauth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VALID_TARGETS = ['daggpt', 'dagchain'];

export async function POST(req: Request) {
  try {
    // 1. Authenticate the requesting user
    const authHeader = req.headers.get('Authorization');
    const cookieStore = await cookies();
    const token = extractBearerToken(authHeader) || cookieStore.get('dagarmy_token')?.value;

    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    let payload;
    try {
      payload = await verifyPlatformJWT(token);
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // 2. Validate target platform
    const body = await req.json();
    const { target } = body;

    if (!target || !VALID_TARGETS.includes(target)) {
      return NextResponse.json({ error: `Invalid target. Must be one of: ${VALID_TARGETS.join(', ')}` }, { status: 400 });
    }

    // 3. Fetch fresh user to ensure they're still active
    const { data: user } = await supabase
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', payload.sub)
      .single();

    if (!user || !user.is_active) {
      return NextResponse.json({ error: 'Account not found or suspended' }, { status: 403 });
    }

    // 4. Sign SSO token
    const { token: ssoToken, jti } = await signSSOToken({
      email: user.email,
      sub: user.id,
      from: 'dagarmy',
      target,
    });

    // 5. Log SSO session in audit table
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await logSSOSession({ jti, userId: user.id, email: user.email, fromPlatform: 'dagarmy', toPlatform: target, expiresAt });

    // 6. Build redirect URL
    const redirect_url = buildSSORedirectUrl(target, ssoToken);

    return NextResponse.json({ success: true, token: ssoToken, redirect_url });
  } catch (err: any) {
    console.error('[/api/auth/sso/issue-token]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
