import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { section_id, question, answer } = body;
  if (!section_id || !question || !answer) {
    return NextResponse.json({ error: 'section_id, question, and answer are required' }, { status: 400 });
  }

  const { data: maxRow } = await supabaseAdmin
    .from('faq_questions')
    .select('sort_order')
    .eq('section_id', section_id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const sort_order = maxRow ? maxRow.sort_order + 1 : 0;

  const { data, error } = await supabaseAdmin
    .from('faq_questions')
    .insert({ section_id, question, answer, sort_order })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ question: data });
}
