import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signPlatformJWT, hashPassword, checkFingerprint } from '@/lib/dagauth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, full_name, role = 'student', fingerprint_id, referral_code } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fingerprint abuse check FIRST
    if (fingerprint_id) {
      const fp = await checkFingerprint(fingerprint_id, normalizedEmail, 'dagarmy', 3);
      if (!fp.allowed) {
        return NextResponse.json({
          error: 'suspicious_device',
          message: 'Too many accounts have been created from this device. Please contact support.',
        }, { status: 403 });
      }
    }

    // 2. Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id, email, wallet_address, password_hash, full_name')
      .eq('email', normalizedEmail)
      .single();

    if (existing && existing.password_hash) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in instead.' }, { status: 409 });
    }

    // 3. Hash password
    const password_hash = await hashPassword(password);

    // 4. Create or update user
    let user;
    if (existing && !existing.password_hash) {
      // Existing wallet-only user — add email+password to their account
      const { data: updated, error } = await supabase
        .from('users')
        .update({
          email: normalizedEmail,
          password_hash,
          full_name: full_name || existing.full_name,
          auth_provider: 'email',
          email_verified: false,
          fingerprint_id: fingerprint_id || null,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      user = updated;
    } else {
      // Brand new user
      const { data: created, error } = await supabase
        .from('users')
        .insert({
          email: normalizedEmail,
          password_hash,
          full_name: full_name || null,
          role,
          auth_provider: 'email',
          email_verified: false,
          fingerprint_id: fingerprint_id || null,
          is_active: true,
          profile_completed: !!full_name,
          platform_last_login: { dagarmy: new Date().toISOString() },
        })
        .select()
        .single();

      if (error) throw error;
      user = created;
    }

    // 5. Handle referral code if provided
    if (referral_code) {
      try {
        const { data: referrer } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', referral_code.toUpperCase())
          .single();
        if (referrer) {
          // Store pending referral — your existing referral system handles the rest
          await supabase.from('referrals').insert({
            referrer_id: referrer.id,
            referee_id: user.id,
            referral_code,
            status: 'pending',
          }).single();
        }
      } catch (refErr) {
        // Non-fatal — don't block registration if referral fails
        console.warn('[register] Referral error:', refErr);
      }
    }

    // 6. Issue JWT
    const token = await signPlatformJWT({
      sub: user.id,
      email: user.email,
      role: user.role || 'student',
      isAdmin: false,
      platform: 'dagarmy',
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      is_admin: false,
      wallet_address: user.wallet_address,
      profile_completed: user.profile_completed,
    };

    const response = NextResponse.json({ success: true, token, user: safeUser, isNewUser: !existing }, { status: 201 });

    response.cookies.set('dagarmy_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('[/api/auth/register]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
