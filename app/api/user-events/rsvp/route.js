import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/user-events/rsvp
// Body: { userId, eventId, action: 'join' | 'unjoin' }
export async function POST(request) {
  try {
    const { userId, eventId, action } = await request.json();

    if (!userId || !eventId || !action) {
      return NextResponse.json({ error: 'userId, eventId and action are required' }, { status: 400 });
    }

    // Fetch the event
    const { data: event, error: eventError } = await supabase
      .from('user_events')
      .select('id, created_by, max_capacity, is_active')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (!event.is_active) {
      return NextResponse.json({ error: 'This event is no longer active' }, { status: 400 });
    }

    // Creator cannot RSVP their own event (they are always +1 host)
    if (event.created_by === userId) {
      return NextResponse.json({ error: 'You are the host of this event' }, { status: 400 });
    }

    if (action === 'join') {
      // Check capacity - only count non-creator RSVPs
      if (event.max_capacity !== null) {
        const { count } = await supabase
          .from('user_event_rsvps')
          .select('id', { count: 'exact', head: true })
          .eq('event_id', eventId);

        if (count >= event.max_capacity) {
          return NextResponse.json({ error: 'This event is full', is_full: true }, { status: 400 });
        }
      }

      const { error: insertError } = await supabase
        .from('user_event_rsvps')
        .insert({ event_id: eventId, user_id: userId });

      if (insertError) {
        if (insertError.code === '23505') {
          return NextResponse.json({ success: true, already_joined: true });
        }
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: 'joined' });

    } else if (action === 'unjoin') {
      const { error: deleteError } = await supabase
        .from('user_event_rsvps')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: 'unjoined' });

    } else {
      return NextResponse.json({ error: 'action must be "join" or "unjoin"' }, { status: 400 });
    }
  } catch (err) {
    console.error('RSVP error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
