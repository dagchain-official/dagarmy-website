import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// DELETE /api/user-events/[id]?userId=...
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json({ error: 'Event ID and userId are required' }, { status: 400 });
    }

    // Verify ownership
    const { data: event, error: fetchError } = await supabase
      .from('user_events')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.created_by !== userId) {
      return NextResponse.json({ error: 'Not authorised - only the creator can delete this event' }, { status: 403 });
    }

    // Delete RSVPs first (cascade should handle it but be explicit)
    await supabase.from('user_event_rsvps').delete().eq('event_id', id);

    const { error: deleteError } = await supabase
      .from('user_events')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting user event:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('User event DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
