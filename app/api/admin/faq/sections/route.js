import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('faq_sections')
    .select('*, faq_questions(*)')
    .order('sort_order', { ascending: true })
    .order('sort_order', { ascending: true, foreignTable: 'faq_questions' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sections: data });
}

export async function POST(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { label, icon_key, color_accent } = body;
  if (!label) return NextResponse.json({ error: 'label is required' }, { status: 400 });

  const { data: maxRow } = await supabaseAdmin
    .from('faq_sections')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const sort_order = maxRow ? maxRow.sort_order + 1 : 0;

  const { data, error } = await supabaseAdmin
    .from('faq_sections')
    .insert({ label, icon_key: icon_key || 'default', color_accent: color_accent || '#6366f1', sort_order })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ section: data });
}
