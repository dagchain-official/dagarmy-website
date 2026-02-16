import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PUT - Update a social task (Master Admin only)
export async function PUT(request, { params }) {
  try {
    const supabase = supabaseAdmin;
    const { id } = await params;
    const body = await request.json();
    const { user_email, ...updates } = body;

    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, is_master_admin')
      .eq('email', user_email)
      .single();

    if (userError || !userData?.is_master_admin) {
      return NextResponse.json({ error: 'Unauthorized - Master Admin access required' }, { status: 403 });
    }

    const allowedFields = ['platform', 'task_type', 'title', 'description', 'points', 'target_url', 'is_active', 'max_completions_per_user', 'expires_at'];
    const sanitized = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) sanitized[key] = updates[key];
    }
    sanitized.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('social_tasks')
      .update(sanitized)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, task: data }, { status: 200 });
  } catch (error) {
    console.error('Error updating social task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a social task (Master Admin only)
export async function DELETE(request, { params }) {
  try {
    const supabase = supabaseAdmin;
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const user_email = searchParams.get('user_email');

    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, is_master_admin')
      .eq('email', user_email)
      .single();

    if (userError || !userData?.is_master_admin) {
      return NextResponse.json({ error: 'Unauthorized - Master Admin access required' }, { status: 403 });
    }

    const { error } = await supabase
      .from('social_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Task deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting social task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
