import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Admin: fetch submissions (optionally filter by status)
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, approved, rejected
    const user_email = searchParams.get('user_email');

    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    // Verify admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, is_master_admin, role')
      .eq('email', user_email)
      .single();

    if (userError || (!userData?.is_master_admin && userData?.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    let query = supabase
      .from('social_task_submissions')
      .select(`
        *,
        task:social_tasks(id, platform, task_type, title, points, target_url),
        user:users!social_task_submissions_user_id_fkey(id, first_name, last_name, email, tier, avatar_url),
        reviewer:users!social_task_submissions_reviewed_by_fkey(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, submissions: data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
