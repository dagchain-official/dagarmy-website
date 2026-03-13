import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/support/tickets/[id] — fetch ticket + messages
export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const { data: messages, error: msgError } = await supabase
      .from('support_ticket_messages')
      .select('*')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;

    return NextResponse.json({ success: true, ticket, messages: messages || [] });
  } catch (err) {
    console.error('GET /api/support/tickets/[id] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
