import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, sendBulkEmails } from '@/lib/email';
import { webinarInvitationEmailTemplate } from '@/lib/email-templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/emails/webinar-invitation
 * Send webinar invitation emails to all users or test email
 * 
 * Body:
 * {
 *   mode: "test" | "all",
 *   testEmail: "test@example.com" (required if mode is "test")
 * }
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const { mode, testEmail } = data;

    if (!mode || !['test', 'all'].includes(mode)) {
      return NextResponse.json(
        { error: 'mode must be either "test" or "all"' },
        { status: 400 }
      );
    }

    if (mode === 'test' && !testEmail) {
      return NextResponse.json(
        { error: 'testEmail is required when mode is "test"' },
        { status: 400 }
      );
    }

    const subject = 'Join Us for an Exclusive DAG Army Webinar - April 8, 2026';

    // Test mode - send to single email
    if (mode === 'test') {
      const html = webinarInvitationEmailTemplate({ userName: 'Test User' });
      
      const result = await sendEmail({
        to: testEmail,
        subject,
        html,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to send test email', details: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        mode: 'test',
        recipient: testEmail,
        messageId: result.messageId
      });
    }

    // All mode - send to all users
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('email, full_name')
      .not('email', 'is', null);

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch users', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'No users found to send emails to' },
        { status: 404 }
      );
    }

    // Prepare bulk emails
    const emails = users.map(user => ({
      to: user.email,
      subject,
      html: webinarInvitationEmailTemplate({ 
        userName: user.full_name || user.email.split('@')[0] 
      }),
    }));

    // Send bulk emails with rate limiting
    const result = await sendBulkEmails(emails);

    // Log the broadcast
    await supabase
      .from('email_broadcasts')
      .insert({
        type: 'webinar_invitation',
        subject,
        total_recipients: users.length,
        sent_count: result.sent,
        failed_count: result.failed,
        sent_at: new Date().toISOString(),
      })
      .catch(() => {}); // Silent fail on logging

    return NextResponse.json({
      success: true,
      message: `Webinar invitations sent to ${result.sent} of ${users.length} users`,
      mode: 'all',
      total: users.length,
      sent: result.sent,
      failed: result.failed,
      results: result.results
    });

  } catch (error) {
    console.error('Error in webinar invitation API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
