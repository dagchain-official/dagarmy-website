import { NextResponse } from 'next/server';
import { getAdminSession, requirePermission } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email/smtp-client';
import { appendToSentFolder } from '@/lib/email/imap-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/admin/email/send
 * Send an email from the current admin's department mailbox.
 * Body: { to, cc?, bcc?, subject, html, text?, replyTo? }
 */
export async function POST(request) {
  const guard = await requirePermission(request, 'notifications.write');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;

  if (!accountEmail) {
    return NextResponse.json({ error: 'No department email configured for this admin' }, { status: 400 });
  }

  let to, cc, bcc, subject, html, text, replyTo, attachmentFiles = [];

  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    to      = JSON.parse(formData.get('to') || '[]');
    cc      = JSON.parse(formData.get('cc') || '[]');
    bcc     = JSON.parse(formData.get('bcc') || '[]');
    subject = formData.get('subject') || '';
    html    = formData.get('html') || '';
    text    = formData.get('text') || '';
    replyTo = formData.get('replyTo') || '';
    const rawFiles = formData.getAll('attachments');
    for (const file of rawFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachmentFiles.push({ filename: file.name, content: buffer, contentType: file.type });
      }
    }
  } else {
    const body = await request.json();
    ({ to, cc, bcc, subject, html, text, replyTo } = body);
  }

  if (!to || !subject || !html) {
    return NextResponse.json({ error: 'to, subject, and html are required' }, { status: 400 });
  }

  const totalAttachmentSize = attachmentFiles.reduce((sum, f) => sum + (f.content?.length || 0), 0);
  if (totalAttachmentSize > 15 * 1024 * 1024) {
    return NextResponse.json({ error: 'Total attachment size cannot exceed 15 MB' }, { status: 413 });
  }

  const toArray = Array.isArray(to) ? to : [to];
  const ccArray = cc ? (Array.isArray(cc) ? cc : [cc]) : [];

  try {
    const { messageId } = await sendEmail(accountEmail, {
      to: toArray,
      cc: ccArray,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [],
      subject,
      html,
      text,
      replyTo,
      attachments: attachmentFiles,
    });

    // Build raw RFC 2822 message and append to IMAP Sent folder
    const rawMessage = buildRawMessage({
      from: accountEmail,
      to: toArray,
      cc: ccArray,
      subject,
      html,
      messageId,
      attachments: attachmentFiles,
    });
    appendToSentFolder(accountEmail, rawMessage).catch(() => {}); // fire-and-forget

    // Log to email_sent_log
    await supabase.from('email_sent_log').insert({
      sent_by: session.user.id,
      from_email: accountEmail,
      to_addresses: toArray,
      cc_addresses: ccArray,
      subject,
      message_id: messageId,
    });

    return NextResponse.json({ success: true, messageId });
  } catch (err) {
    console.error('SMTP send error:', err);
    return NextResponse.json(
      { error: 'Failed to send email', details: err.message },
      { status: 500 }
    );
  }
}

function buildRawMessage({ from, to, cc, subject, html, messageId, attachments = [] }) {
  const date  = new Date().toUTCString();
  const toStr = Array.isArray(to) ? to.join(', ') : to;
  const ccLine = cc && cc.length ? `Cc: ${Array.isArray(cc) ? cc.join(', ') : cc}\r\n` : '';
  const msgId  = messageId || `<${Date.now()}@dagchain.network>`;

  const commonHeaders = [
    `From: ${from}`,
    `To: ${toStr}`,
    ccLine.trim() || null,
    `Subject: ${subject}`,
    `Date: ${date}`,
    `Message-ID: ${msgId}`,
    `MIME-Version: 1.0`,
  ].filter(Boolean).join('\r\n');

  const htmlB64 = Buffer.from(html || '').toString('base64').replace(/(.{76})/g, '$1\r\n');

  if (!attachments || attachments.length === 0) {
    return [
      commonHeaders,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,
      ``,
      htmlB64,
    ].join('\r\n');
  }

  // Multipart/mixed for messages with attachments
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const parts = [];

  // HTML part
  parts.push([
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    htmlB64,
  ].join('\r\n'));

  // Attachment parts
  for (const att of attachments) {
    const attB64 = att.content.toString('base64').replace(/(.{76})/g, '$1\r\n');
    parts.push([
      `--${boundary}`,
      `Content-Type: ${att.contentType || 'application/octet-stream'}; name="${att.filename}"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: attachment; filename="${att.filename}"`,
      ``,
      attB64,
    ].join('\r\n'));
  }

  parts.push(`--${boundary}--`);

  return [
    commonHeaders,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    parts.join('\r\n'),
  ].join('\r\n');
}
