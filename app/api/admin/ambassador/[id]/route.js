import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PATCH(request, { params }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const body = await request.json();
  const { status, internal_notes } = body;

  const validStatuses = ['new', 'reviewed', 'shortlisted', 'approved', 'rejected'];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updates = {};
  if (status) updates.status = status;
  if (internal_notes !== undefined) updates.internal_notes = internal_notes;

  const { data, error } = await supabaseAdmin
    .from('ambassador_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update ambassador application error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }

  return NextResponse.json({ application: data });
}
