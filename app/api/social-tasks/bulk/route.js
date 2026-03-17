import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST - Bulk create daily missions (Master Admin only)
// Body: { user_email, missions: [{ platform, task_type, title, description, points, target_url, max_completions_per_user, scheduled_date }] }
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { user_email, missions, mission_type } = body;

    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }
    if (!Array.isArray(missions) || missions.length === 0) {
      return NextResponse.json({ error: 'missions array is required and must not be empty' }, { status: 400 });
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

    // Validate each row
    const errors = [];
    missions.forEach((m, i) => {
      if (!m.platform)      errors.push(`Row ${i + 1}: platform required`);
      if (!m.task_type)     errors.push(`Row ${i + 1}: task_type required`);
      if (!m.title?.trim()) errors.push(`Row ${i + 1}: title required`);
      if (!m.points || m.points < 1) errors.push(`Row ${i + 1}: points must be > 0`);
      if (!m.scheduled_date) errors.push(`Row ${i + 1}: scheduled_date required`);
    });
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('; ') }, { status: 400 });
    }

    const resolvedType = ['daily', 'community'].includes(mission_type) ? mission_type : 'daily';

    const rows = missions.map(m => ({
      platform:                 m.platform,
      task_type:                m.task_type,
      title:                    m.title.trim(),
      description:              m.description?.trim() || null,
      points:                   parseInt(m.points),
      target_url:               m.target_url?.trim() || null,
      max_completions_per_user: parseInt(m.max_completions_per_user) || 1,
      expires_at:               null,
      mission_type:             resolvedType,
      scheduled_date:           m.scheduled_date || null,
      is_active:                false,
      created_by:               userData.id,
    }));

    const { data, error } = await supabase
      .from('social_tasks')
      .insert(rows)
      .select('id, title, scheduled_date, platform, task_type');

    if (error) throw error;

    return NextResponse.json({ success: true, created: data.length, tasks: data }, { status: 201 });
  } catch (error) {
    console.error('Error bulk creating daily missions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
