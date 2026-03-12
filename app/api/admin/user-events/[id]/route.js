import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// PATCH /api/admin/user-events/[id] — deactivate (set is_active = false)
export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { error } = await supabase
      .from('user_events')
      .update({ is_active: body.is_active !== undefined ? body.is_active : false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/user-events/[id] — hard delete
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    await supabase.from('user_event_rsvps').delete().eq('event_id', id);

    const { error } = await supabase.from('user_events').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
