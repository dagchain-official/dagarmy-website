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
  const { label, icon_key, color_accent, sort_order } = body;

  const updates = {};
  if (label !== undefined) updates.label = label;
  if (icon_key !== undefined) updates.icon_key = icon_key;
  if (color_accent !== undefined) updates.color_accent = color_accent;
  if (sort_order !== undefined) updates.sort_order = sort_order;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('faq_sections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ section: data });
}

export async function DELETE(request, { params }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;

  await supabaseAdmin.from('faq_questions').delete().eq('section_id', id);

  const { error } = await supabaseAdmin
    .from('faq_sections')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
