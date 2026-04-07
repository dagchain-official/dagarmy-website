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
const BATCH_SIZE = 25;

/**
 * POST /api/emails/webinar-invitation
 * Send webinar invitation emails
 * 
 * Body:
 * {
 *   mode: "test" | "batch",
 *   testEmail: "test@example.com" (required if mode is "test")
 *   userIds: ["id1", "id2", ...] (required if mode is "batch" — max 25)
 * }
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const { mode, testEmail, userIds } = data;

    if (!mode || !['test', 'batch'].includes(mode)) {
      return NextResponse.json(
        { error: 'mode must be either "test" or "batch"' },
        { status: 400 }
      );
    }

    const subject = 'Join Us for an Exclusive DAG Army Webinar - April 8, 2026';

    // Test mode - send to single email
    if (mode === 'test') {
      if (!testEmail) {
        return NextResponse.json(
          { error: 'testEmail is required when mode is "test"' },
          { status: 400 }
        );
      }

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

    // Batch mode - send to specific user IDs (max 25)
    if (mode === 'batch') {
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return NextResponse.json(
          { error: 'userIds array is required for batch mode' },
          { status: 400 }
        );
      }

      if (userIds.length > BATCH_SIZE) {
        return NextResponse.json(
          { error: `Maximum ${BATCH_SIZE} users per batch` },
          { status: 400 }
        );
      }

      // Fetch the selected users
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('id, email, full_name')
        .in('id', userIds)
        .not('email', 'is', null);

      if (fetchError) {
        return NextResponse.json(
          { error: 'Failed to fetch users', details: fetchError.message },
          { status: 500 }
        );
      }

      if (!users || users.length === 0) {
        return NextResponse.json(
          { error: 'No valid users found for the provided IDs' },
          { status: 404 }
        );
      }

      // Send emails one-by-one
      let sent = 0;
      let failed = 0;
      const results = [];
      const sentUserIds = [];
      const failedUserIds = [];

      for (const user of users) {
        const userName = user.full_name || user.email.split('@')[0];
        const html = webinarInvitationEmailTemplate({ userName });

        try {
          const result = await sendEmail(SENDER_EMAIL, {
            to: user.email,
            subject,
            html,
          });
          sent++;
          sentUserIds.push(user.id);
          results.push({ id: user.id, to: user.email, success: true, messageId: result.messageId });
        } catch (err) {
          failed++;
          failedUserIds.push(user.id);
          results.push({ id: user.id, to: user.email, success: false, error: err.message });
        }

        // 2s delay between emails to respect SMTP rate limits
        if (users.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      return NextResponse.json({
        success: true,
        message: `Sent ${sent} of ${users.length} emails`,
        mode: 'batch',
        total: users.length,
        sent,
        failed,
        sentUserIds,
        failedUserIds,
        results
      });
    }

  } catch (error) {
    console.error('Error in webinar invitation API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
