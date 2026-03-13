import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PATCH(request, context) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  const allowed = ['title', 'department', 'location', 'work_mode', 'employment_type',
    'summary', 'responsibilities', 'requirements', 'nice_to_have', 'is_active'];
  const updates = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('job_postings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update job posting error:', error);
    return NextResponse.json({ error: 'Failed to update job posting' }, { status: 500 });
  }

  return NextResponse.json({ posting: data });
}

export async function DELETE(request, context) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  const { error } = await supabaseAdmin
    .from('job_postings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete job posting error:', error);
    return NextResponse.json({ error: 'Failed to delete job posting' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
