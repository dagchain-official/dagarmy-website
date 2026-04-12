import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SMTP_FROM = process.env.SMTP_FROM_NAME || 'DAGARMY';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dagarmy.network';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('email', normalizedEmail)
      .single();

    // Security: always return success even if user not found (prevents email enumeration)
    if (!user) {
      return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 3. Store reset token
    await supabase.from('users').update({
      reset_token: resetToken,
      reset_token_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    // 4. Send reset email using existing DAGARMY email infrastructure
    const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

    try {
      // Use the existing email API
      await fetch(`${APP_URL}/api/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: normalizedEmail,
          subject: 'Reset Your DAGARMY Password',
          html: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h2 style="color: #1f2937; margin-bottom: 16px;">Reset Your Password</h2>
              <p style="color: #4b5563; margin-bottom: 24px;">
                Hi ${user.full_name || 'there'}, we received a request to reset your DAGARMY password.
              </p>
              <a href="${resetUrl}" style="
                display: inline-block;
                padding: 14px 28px;
                background: #1f2937;
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                margin-bottom: 24px;
              ">Reset Password</a>
              <p style="color: #9ca3af; font-size: 14px;">
                This link expires in 1 hour. If you didn't request this, ignore this email.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
                Or copy this link: ${resetUrl}
              </p>
            </div>
          `,
        }),
      });
    } catch (emailErr) {
      console.error('[forgot-password] Email send failed:', emailErr);
      // Still return success — token is stored, user can contact support
    }

    return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err: any) {
    console.error('[/api/auth/forgot-password]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
