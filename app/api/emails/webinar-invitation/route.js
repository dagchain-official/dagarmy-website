import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/smtp-client';
import { webinarInvitationEmailTemplate } from '@/lib/email-templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// The sender account — must match an entry in smtp-client.js ACCOUNT_MAP
const SENDER_EMAIL = 'admin@dagchain.network';

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
      
      try {
        const result = await sendEmail(SENDER_EMAIL, {
          to: testEmail,
          subject,
          html,
        });

        return NextResponse.json({
          success: true,
          message: 'Test email sent successfully',
          mode: 'test',
          recipient: testEmail,
          messageId: result.messageId
        });
      } catch (sendErr) {
        console.error('Failed to send test webinar email:', sendErr);
        return NextResponse.json(
          { error: 'Failed to send test email', details: sendErr.message },
          { status: 500 }
        );
      }
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

    // Send emails one-by-one with rate limiting
    let sent = 0;
    let failed = 0;
    const results = [];

    for (const user of users) {
      const html = webinarInvitationEmailTemplate({ 
        userName: user.full_name || user.email.split('@')[0] 
      });

      try {
        const result = await sendEmail(SENDER_EMAIL, {
          to: user.email,
          subject,
          html,
        });
        sent++;
        results.push({ to: user.email, success: true, messageId: result.messageId });
      } catch (err) {
        failed++;
        results.push({ to: user.email, success: false, error: err.message });
      }

      // Small delay between emails to respect SMTP rate limits
      if (users.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Log the broadcast
    await supabase
      .from('email_broadcasts')
      .insert({
        type: 'webinar_invitation',
        subject,
        total_recipients: users.length,
        sent_count: sent,
        failed_count: failed,
        sent_at: new Date().toISOString(),
      })
      .catch(() => {}); // Silent fail on logging

    return NextResponse.json({
      success: true,
      message: `Webinar invitations sent to ${sent} of ${users.length} users`,
      mode: 'all',
      total: users.length,
      sent,
      failed,
      results
    });

  } catch (error) {
    console.error('Error in webinar invitation API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

