import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/support/tickets/[id]/reply
export async function POST(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { sender_type, sender_email, sender_name, message } = body;

    if (!sender_type || !sender_email || !message) {
      return NextResponse.json(
        { error: 'sender_type, sender_email, and message are required' },
        { status: 400 }
      );
    }

    // Verify ticket exists
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('id, status, user_email, user_name, subject, ticket_number')
      .eq('id', id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Insert reply message
    const { data: msg, error: msgError } = await supabase
      .from('support_ticket_messages')
      .insert({
        ticket_id: id,
        sender_type,
        sender_email,
        sender_name: sender_name || null,
        message,
      })
      .select()
      .single();

    if (msgError) throw msgError;

    // If admin replied, update ticket status to in_progress (if still open) and send notification
    if (sender_type === 'admin') {
      // Update status if still open
      if (ticket.status === 'open') {
        await supabase
          .from('support_tickets')
          .update({ status: 'in_progress' })
          .eq('id', id);
      }

      // Send push notification to the student via existing notification system
      try {
        // Look up the student's user_id
        const { data: studentUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', ticket.user_email)
          .single();

        if (studentUser) {
          await supabase.from('notifications').insert({
            title: `Reply on ${ticket.ticket_number}`,
            message: `Admin replied to your support ticket: "${ticket.subject}". Check your Support page for the response.`,
            type: 'info',
            priority: 'normal',
            is_global: false,
            target_user_id: studentUser.id,
            sender_name: sender_name || 'Support Team',
            action_url: '/student-support',
            action_label: 'View Ticket',
          });
        }
      } catch (notifErr) {
        // Non-blocking - don't fail the reply if notification fails
        console.error('Failed to send notification for ticket reply:', notifErr);
      }
    }

    // If user replied, update status to open (re-open if waiting)
    if (sender_type === 'user' && ticket.status === 'waiting_on_user') {
      await supabase
        .from('support_tickets')
        .update({ status: 'open' })
        .eq('id', id);
    }

    return NextResponse.json({ success: true, message: msg });
  } catch (err) {
    console.error('POST /api/support/tickets/[id]/reply error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
