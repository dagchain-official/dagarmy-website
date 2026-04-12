import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signPlatformJWT, verifyPassword, checkFingerprint } from '@/lib/dagauth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fingerprint_id } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 2. Check if user has a password set
    if (!user.password_hash) {
      // Wallet-only user — prompt them to set password
      if (user.wallet_address) {
        return NextResponse.json({
          error: 'wallet_only_user',
          message: 'This account was created with a wallet. Please use "Forgot Password" to set up a password.',
          email: user.email,
        }, { status: 401 });
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 3. Verify password
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 4. Check if account is active
    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is suspended. Please contact support.' }, { status: 403 });
    }

    // 5. Fingerprint check (soft — login is allowed but flagged if suspicious)
    if (fingerprint_id) {
      const fp = await checkFingerprint(fingerprint_id, normalizedEmail, 'dagarmy', 5);
      if (!fp.allowed) {
        return NextResponse.json({
          error: 'suspicious_device',
          message: 'Too many accounts detected on this device. Please contact support.',
        }, { status: 403 });
      }
      // Update fingerprint on user
      await supabase.from('users').update({ fingerprint_id, updated_at: new Date().toISOString() }).eq('id', user.id);
    }

    // 6. Update last login
    await supabase
      .from('users')
      .update({
        platform_last_login: { ...(user.platform_last_login || {}), dagarmy: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // 7. Issue JWT
    const token = await signPlatformJWT({
      sub: user.id,
      email: user.email,
      role: user.role || 'student',
      isAdmin: user.is_admin || false,
      isMasterAdmin: user.is_master_admin || false,
      platform: 'dagarmy',
    });

    // 8. Build safe user object
    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      is_admin: user.is_admin,
      is_master_admin: user.is_master_admin,
      wallet_address: user.wallet_address,
      profile_completed: user.profile_completed,
    };

    const response = NextResponse.json({ success: true, token, user: safeUser });

    // Set httpOnly cookie for middleware-level auth checks
    response.cookies.set('dagarmy_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('[/api/auth/login]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
