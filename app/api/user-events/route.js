import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/user-events?userId=...&joined=true&filter=upcoming|past
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const joinedOnly = searchParams.get('joined') === 'true';
    const filter = searchParams.get('filter') || 'upcoming'; // upcoming | past | all
    const today = new Date().toISOString().split('T')[0];

    let query = supabase
      .from('user_events')
      .select(`
        *,
        creator:users!user_events_created_by_fkey(id, first_name, last_name, tier),
        rsvps:user_event_rsvps(count)
      `)
      .eq('is_active', true);

    if (filter === 'upcoming') {
      query = query.gte('event_date', today);
    } else if (filter === 'past') {
      query = query.lt('event_date', today);
    }

    query = query.order('event_date', { ascending: filter !== 'past' });

    const { data: events, error } = await query;

    if (error) {
      console.error('Error fetching user events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If joinedOnly, filter to events where userId has RSVP'd
    let rsvpSet = new Set();
    if (userId) {
      const { data: myRsvps } = await supabase
        .from('user_event_rsvps')
        .select('event_id')
        .eq('user_id', userId);
      if (myRsvps) myRsvps.forEach(r => rsvpSet.add(r.event_id));
    }

    const enriched = (events || [])
      .filter(e => !joinedOnly || rsvpSet.has(e.id))
      .map(e => {
        const rsvpCount = e.rsvps?.[0]?.count ?? 0;
        const isFull = e.max_capacity !== null && rsvpCount >= e.max_capacity;
        const isCreator = userId && e.created_by === userId;
        const hasJoined = rsvpSet.has(e.id);
        const creatorName = e.creator
          ? `${e.creator.first_name || ''} ${e.creator.last_name || ''}`.trim() || 'Unknown'
          : 'Unknown';
        return {
          ...e,
          rsvp_count: rsvpCount,
          is_full: isFull,
          is_creator: isCreator,
          has_joined: hasJoined,
          creator_name: creatorName,
          creator_tier: e.creator?.tier || 'DAG_SOLDIER',
        };
      });

    return NextResponse.json({ events: enriched });
  } catch (err) {
    console.error('User events GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user-events - create a new event
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      title,
      description,
      event_date,
      event_time,
      end_time,
      event_type,
      location,
      is_online,
      meeting_link,
      max_capacity,
    } = body;

    if (!userId || !title || !event_date) {
      return NextResponse.json({ error: 'userId, title and event_date are required' }, { status: 400 });
    }

    const { data: event, error } = await supabase
      .from('user_events')
      .insert({
        created_by: userId,
        title,
        description: description || null,
        event_date,
        event_time: event_time || null,
        end_time: end_time || null,
        event_type: event_type || 'workshop',
        location: location || null,
        is_online: is_online !== undefined ? is_online : true,
        meeting_link: meeting_link || null,
        max_capacity: max_capacity ? parseInt(max_capacity) : null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error('User events POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
