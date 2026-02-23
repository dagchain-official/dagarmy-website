import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '@/lib/admin-auth';
import { sendEmail, sendBulkEmails } from '@/lib/email';
import { hrBroadcastEmailTemplate } from '@/lib/email-templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/admin/hr-broadcast/send
 * Sends a broadcast email to a targeted audience segment.
 *
 * Body:
 *   mode          'template' | 'plain'   — email format
 *   audience      'all' | 'student' | 'instructor' | 'inactive' | 'new'
 *   priority      'normal' | 'high' | 'urgent'
 *   subject       Email subject line
 *   bannerHeadline  (template mode) Large banner headline
 *   bannerSub       (template mode) Smaller sub-headline (optional)
 *   greeting        (template mode) Opening line, supports {{name}} placeholder
 *   bodyText        Main message body (plain text — newlines become <br> in template mode)
 *   ctaText         (template mode) CTA button label (optional)
 *   ctaUrl          (template mode) CTA button URL (optional)
 *   senderName      Shown at bottom of template email
 */
export async function POST(request) {
  const guard = await requirePermission(request, 'notifications.write');
  if (guard) return guard;

  try {
    const {
      mode = 'template',
      audience = 'all',
      priority = 'normal',
      subject,
      bannerHeadline,
      bannerSub = '',
      greeting = '',
      bodyText,
      ctaText = '',
      ctaUrl = '',
      senderName = 'DAG Army HR Team',
    } = await request.json();

    if (!subject?.trim()) {
      return NextResponse.json({ error: 'subject is required' }, { status: 400 });
    }
    if (!bodyText?.trim()) {
      return NextResponse.json({ error: 'bodyText is required' }, { status: 400 });
    }

    // ── Resolve recipient list ──────────────────────────────────────────────
    const now = new Date();
    let query = supabase.from('users').select('id, full_name, email, role, last_sign_in_at, created_at');

    if (audience === 'student') {
      query = query.eq('role', 'student');
    } else if (audience === 'instructor') {
      query = query.eq('role', 'instructor');
    } else if (audience === 'inactive') {
      const cutoff = new Date(now); cutoff.setDate(now.getDate() - 30);
      query = query.lt('last_sign_in_at', cutoff.toISOString());
    } else if (audience === 'new') {
      const cutoff = new Date(now); cutoff.setDate(now.getDate() - 7);
      query = query.gte('created_at', cutoff.toISOString());
    }
    // 'all' — no extra filter

    const { data: users, error: usersErr } = await query;
    if (usersErr) throw usersErr;

    const recipients = (users || []).filter(u => u.email);
    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients found for this audience' }, { status: 400 });
    }

    // ── Build email list ────────────────────────────────────────────────────
    const bodyHtml = bodyText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    const emails = recipients.map(user => {
      const name = user.full_name || user.email.split('@')[0] || 'Member';
      const resolvedGreeting = greeting
        ? greeting.replace(/\{\{name\}\}/gi, name)
        : `Dear ${name},`;

      let html;
      if (mode === 'template') {
        html = hrBroadcastEmailTemplate({
          recipientName: name,
          bannerHeadline: bannerHeadline || subject,
          bannerSub,
          greeting: resolvedGreeting,
          bodyHtml,
          ctaText,
          ctaUrl,
          senderName,
          priority,
        });
      } else {
        // Plain text mode — minimal HTML wrapper
        html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;color:#000;line-height:1.6;padding:24px;max-width:600px;margin:0 auto;">
  <p style="font-weight:700;font-size:16px;margin:0 0 16px;">${resolvedGreeting}</p>
  <div style="margin:0 0 24px;">${bodyHtml}</div>
  ${ctaText && ctaUrl ? `<p><a href="${ctaUrl}" style="background:#4158f9;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">${ctaText}</a></p>` : ''}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
  <p style="font-size:12px;color:#747474;">Sent by ${senderName} on behalf of DAG Army.</p>
</body></html>`;
      }

      return { to: user.email, subject: subject.trim(), html };
    });

    // ── Send (bulk, rate-limited) ───────────────────────────────────────────
    const result = await sendBulkEmails(emails);

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      total: recipients.length,
      results: result.results,
    });

  } catch (err) {
    console.error('hr-broadcast send error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
