import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email/smtp-client';

export async function POST(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { to, subject, message } = body;

  if (!to || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'to, subject, and message are required' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
      <div style="margin-bottom: 24px;">
        <img src="https://dagarmy.network/images/logo/logo.png" alt="DAGARMY" style="height: 36px;" />
      </div>
      <div style="white-space: pre-wrap; font-size: 15px; line-height: 1.7; color: #374151;">
        ${message.trim().replace(/\n/g, '<br/>')}
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        This email was sent from the DAGARMY Admin Panel · <a href="https://dagarmy.network" style="color: #6366f1;">dagarmy.network</a>
      </p>
    </div>
  `;

  try {
    await sendEmail('admin@dagchain.network', {
      to: [to],
      subject: subject.trim(),
      html,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email applicant error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
