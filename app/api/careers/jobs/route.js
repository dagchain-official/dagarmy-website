import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('job_postings')
    .select('id, title, slug, department, location, work_mode, employment_type, summary, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch public jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }

  return NextResponse.json({ jobs: data });
}
