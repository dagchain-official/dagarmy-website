import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySSOToken, signPlatformJWT, isSSOTokenUsed, markSSOTokenUsed } from '@/lib/dagauth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'SSO token is required' }, { status: 400 });
    }

    // 1. Verify SSO JWT signature + expiry
    let ssoPayload;
    try {
      ssoPayload = await verifySSOToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired SSO token' }, { status: 401 });
    }

    // 2. Ensure this token targets dagarmy
    if (ssoPayload.target !== 'dagarmy') {
      return NextResponse.json({ error: 'SSO token not intended for this platform' }, { status: 400 });
    }

    // 3. Enforce single-use (check jti wasn't already used)
    const jti = ssoPayload.jti as string;
    if (await isSSOTokenUsed(jti)) {
      return NextResponse.json({ error: 'SSO token already used' }, { status: 401 });
    }

    // 4. Mark token as used IMMEDIATELY (prevent replay)
    await markSSOTokenUsed(jti);

    // 5. Find or create user in Supabase by email
    const email = ssoPayload.email as string;
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (!user) {
      // Auto-create user from SSO (they exist on the other platform)
      const { data: created } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase(),
          role: 'student',
          auth_provider: ssoPayload.from as string,
          email_verified: true,
          is_active: true,
          profile_completed: false,
          platform_last_login: { dagarmy: new Date().toISOString() },
        })
        .select()
        .single();
      user = created;
    } else {
      // Update last login for DAGARMY
      await supabase.from('users')
        .update({ platform_last_login: { ...(user.platform_last_login || {}), dagarmy: new Date().toISOString() } })
        .eq('id', user.id);
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to resolve user account' }, { status: 500 });
    }

    // 6. Issue DAGARMY platform JWT
    const platformToken = await signPlatformJWT({
      sub: user.id,
      email: user.email,
      role: user.role || 'student',
      isAdmin: user.is_admin || false,
      isMasterAdmin: user.is_master_admin || false,
      platform: 'dagarmy',
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      is_admin: user.is_admin,
      wallet_address: user.wallet_address,
      profile_completed: user.profile_completed,
    };

    const response = NextResponse.json({ success: true, token: platformToken, user: safeUser });
    response.cookies.set('dagarmy_token', platformToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('[/api/auth/sso/validate]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
