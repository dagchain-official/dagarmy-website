import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST - User submits proof for a social task
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { task_id, user_email, proof_url, proof_screenshot_url } = body;

    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    if (!task_id) {
      return NextResponse.json({ error: 'task_id is required' }, { status: 400 });
    }

    if (!proof_url && !proof_screenshot_url) {
      return NextResponse.json({ error: 'At least one proof (URL or screenshot) is required' }, { status: 400 });
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, tier')
      .eq('email', user_email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check task exists and is active
    const { data: task, error: taskError } = await supabase
      .from('social_tasks')
      .select('*')
      .eq('id', task_id)
      .eq('is_active', true)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found or inactive' }, { status: 404 });
    }

    // Check expiry
    if (task.expires_at && new Date(task.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This task has expired' }, { status: 400 });
    }

    // Check if user already has a pending or approved submission for this task
    const { data: existing } = await supabase
      .from('social_task_submissions')
      .select('id, status')
      .eq('task_id', task_id)
      .eq('user_id', user.id)
      .in('status', ['pending', 'approved']);

    const approvedCount = existing?.filter(s => s.status === 'approved').length || 0;
    const pendingCount = existing?.filter(s => s.status === 'pending').length || 0;

    if (pendingCount > 0) {
      return NextResponse.json({ error: 'You already have a pending submission for this task' }, { status: 400 });
    }

    if (approvedCount >= (task.max_completions_per_user || 1)) {
      return NextResponse.json({ error: 'You have already completed this task the maximum number of times' }, { status: 400 });
    }

    // Create submission
    const { data: submission, error: submitError } = await supabase
      .from('social_task_submissions')
      .insert({
        task_id,
        user_id: user.id,
        proof_url: proof_url || null,
        proof_screenshot_url: proof_screenshot_url || null,
        status: 'pending'
      })
      .select()
      .single();

    if (submitError) throw submitError;

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error('Error submitting task proof:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
