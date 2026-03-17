import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST - Activate all daily missions whose scheduled_date <= today
// Called by a cron job (e.g. Vercel Cron, daily at midnight)
// Also callable manually by master admin
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json().catch(() => ({}));
    const { user_email, cron_secret } = body;

    // Allow either master admin call or cron secret
    const validCronSecret = process.env.CRON_SECRET && cron_secret === process.env.CRON_SECRET;
    let isAuthorized = validCronSecret;

    if (!isAuthorized && user_email) {
      const { data: userData } = await supabase
        .from('users')
        .select('is_master_admin')
        .eq('email', user_email)
        .single();
      isAuthorized = userData?.is_master_admin === true;
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Activate all missions scheduled for today or earlier that are still inactive
    const { data, error } = await supabase
      .from('social_tasks')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('mission_type', 'daily')
      .eq('is_active', false)
      .lte('scheduled_date', today)
      .not('scheduled_date', 'is', null)
      .select('id, title, scheduled_date');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      activated: data?.length ?? 0,
      tasks: data,
      date: today,
    });
  } catch (error) {
    console.error('Error activating scheduled missions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Preview which missions would be activated today (no changes)
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('social_tasks')
      .select('id, title, scheduled_date, platform, task_type, points')
      .eq('mission_type', 'daily')
      .eq('is_active', false)
      .lte('scheduled_date', today)
      .not('scheduled_date', 'is', null)
      .order('scheduled_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, pending_activation: data?.length ?? 0, tasks: data, date: today });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
