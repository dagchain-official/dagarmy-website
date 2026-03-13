import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateSlug(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50);
  const uid = Math.random().toString(36).slice(2, 7);
  return `${base}-${uid}`;
}

export async function GET(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('job_postings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch job postings error:', error);
    return NextResponse.json({ error: 'Failed to fetch job postings' }, { status: 500 });
  }

  return NextResponse.json({ postings: data });
}

export async function POST(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const {
    title, department, location, work_mode, employment_type,
    summary, responsibilities, requirements, nice_to_have, is_active,
  } = body;

  if (!title?.trim() || !summary?.trim() || !responsibilities?.trim() || !requirements?.trim()) {
    return NextResponse.json({ error: 'title, summary, responsibilities, and requirements are required' }, { status: 400 });
  }

  const slug = generateSlug(title.trim());

  const { data, error } = await supabaseAdmin
    .from('job_postings')
    .insert({
      title: title.trim(),
      slug,
      department: department?.trim() || '',
      location: location?.trim() || 'Remote',
      work_mode: work_mode || 'Remote',
      employment_type: employment_type || 'Full-time',
      summary: summary.trim(),
      responsibilities: responsibilities.trim(),
      requirements: requirements.trim(),
      nice_to_have: nice_to_have?.trim() || null,
      is_active: is_active !== false,
      created_by: null,
    })
    .select()
    .single();

  if (error) {
    console.error('Create job posting error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create job posting' }, { status: 500 });
  }

  return NextResponse.json({ posting: data }, { status: 201 });
}
