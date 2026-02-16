import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - List all social tasks (optionally filter by active only)
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';

    let query = supabase
      .from('social_tasks')
      .select('*, created_by_user:users!social_tasks_created_by_fkey(first_name, last_name, email)')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, tasks: data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching social tasks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new social task (Master Admin only)
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { platform, task_type, title, description, points, target_url, max_completions_per_user, expires_at, user_email } = body;

    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    // Verify master admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, is_master_admin')
      .eq('email', user_email)
      .single();

    if (userError || !userData?.is_master_admin) {
      return NextResponse.json({ error: 'Unauthorized - Master Admin access required' }, { status: 403 });
    }

    if (!platform || !task_type || !title || !points) {
      return NextResponse.json({ error: 'Missing required fields: platform, task_type, title, points' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('social_tasks')
      .insert({
        platform,
        task_type,
        title,
        description: description || null,
        points,
        target_url: target_url || null,
        max_completions_per_user: max_completions_per_user || 1,
        expires_at: expires_at || null,
        created_by: userData.id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, task: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating social task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
