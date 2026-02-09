import { NextResponse } from 'next/server';
import { sendEmail, sendBulkEmails } from '@/lib/email';
import { announcementEmailTemplate } from '@/lib/email-templates';

/**
 * POST /api/emails/send
 * Send emails to one or more recipients (admin/trainer use)
 * 
 * Body:
 * {
 *   recipients: ["email1@example.com", "email2@example.com"],
 *   subject: "Email subject",
 *   title: "Header title shown in email",
 *   body: "HTML body content",
 *   ctaText: "Button text" (optional),
 *   ctaUrl: "https://..." (optional),
 *   senderName: "Admin Name" (optional),
 *   senderEmail: "admin@dagarmy.network" (optional, for auth check)
 * }
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const { recipients, subject, title, body, ctaText, ctaUrl, senderName, senderEmail } = data;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'At least one recipient email is required' },
        { status: 400 }
      );
    }

    if (!subject || !title || !body) {
      return NextResponse.json(
        { error: 'subject, title, and body are required' },
        { status: 400 }
      );
    }

    const html = announcementEmailTemplate({ title, body, ctaText, ctaUrl, senderName });

    // Single recipient
    if (recipients.length === 1) {
      const result = await sendEmail({
        to: recipients[0],
        subject,
        html,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to send email', details: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId
      });
    }

    // Multiple recipients - send individually (not CC/BCC) for privacy
    const emails = recipients.map(to => ({ to, subject, html }));
    const result = await sendBulkEmails(emails);

    return NextResponse.json({
      success: true,
      message: `Sent ${result.sent} of ${recipients.length} emails`,
      sent: result.sent,
      failed: result.failed,
      results: result.results
    });

  } catch (error) {
    console.error('Error in send email API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
