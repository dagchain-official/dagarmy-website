import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch tasks with user's submission status
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const user_email = searchParams.get('user_email');

    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    // Get user with rank
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, tier, current_rank')
      .eq('email', user_email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all active tasks
    const { data: tasks, error: taskError } = await supabase
      .from('social_tasks')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (taskError) throw taskError;

    // Get user's submissions
    const { data: submissions, error: subError } = await supabase
      .from('social_task_submissions')
      .select('*')
      .eq('user_id', user.id);

    if (subError) throw subError;

    // Get LT bonus rate + rank bonus configs
    const rankBonusKeys = [
      'rank_upgrade_bonus_initiator','rank_upgrade_bonus_vanguard','rank_upgrade_bonus_guardian',
      'rank_upgrade_bonus_striker','rank_upgrade_bonus_invoker','rank_upgrade_bonus_commander',
      'rank_upgrade_bonus_champion','rank_upgrade_bonus_conqueror','rank_upgrade_bonus_paragon',
      'rank_upgrade_bonus_mythic'
    ];
    const { data: configs } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', ['social_task_lt_bonus_rate', ...rankBonusKeys]);

    const configMap = {};
    configs?.forEach(c => { configMap[c.config_key] = c.config_value; });

    const ltBonusRate = configMap.social_task_lt_bonus_rate || 20;
    const isLT = user.tier === 'DAG_LIEUTENANT';
    const hasRank = isLT && user.current_rank && user.current_rank !== 'None';
    const rankKey = hasRank ? 'rank_upgrade_bonus_' + user.current_rank.toLowerCase() : null;
    const rankBonusRate = rankKey ? (configMap[rankKey] || 0) : 0;

    // Merge tasks with submission status
    const tasksWithStatus = tasks.map(task => {
      const userSubs = submissions.filter(s => s.task_id === task.id);
      const approved = userSubs.filter(s => s.status === 'approved');
      const pending = userSubs.filter(s => s.status === 'pending');
      const rejected = userSubs.filter(s => s.status === 'rejected');

      const maxCompletions = task.max_completions_per_user || 1;
      const isExpired = task.expires_at && new Date(task.expires_at) < new Date();

      let userStatus = 'available';
      if (approved.length >= maxCompletions) userStatus = 'completed';
      else if (pending.length > 0) userStatus = 'pending';
      else if (isExpired) userStatus = 'expired';

      const ltBonus = isLT ? Math.round((task.points * ltBonusRate) / 100) : 0;
      const rankBonus = hasRank ? Math.round((task.points * rankBonusRate) / 100) : 0;
      const effectivePoints = task.points + ltBonus + rankBonus;

      return {
        ...task,
        user_status: userStatus,
        submissions: userSubs,
        approved_count: approved.length,
        pending_count: pending.length,
        rejected_count: rejected.length,
        effective_points: effectivePoints,
        lt_bonus: ltBonus,
        rank_bonus: rankBonus
      };
    });

    // Stats
    const totalCompleted = tasksWithStatus.filter(t => t.user_status === 'completed').length;
    const totalPending = tasksWithStatus.filter(t => t.user_status === 'pending').length;
    const totalPointsEarned = submissions
      .filter(s => s.status === 'approved')
      .reduce((sum, s) => sum + (s.points_awarded || 0), 0);

    return NextResponse.json({
      success: true,
      tasks: tasksWithStatus,
      stats: {
        total_tasks: tasks.length,
        completed: totalCompleted,
        pending: totalPending,
        available: tasksWithStatus.filter(t => t.user_status === 'available').length,
        total_points_earned: totalPointsEarned
      },
      is_lieutenant: isLT,
      lt_bonus_rate: ltBonusRate,
      current_rank: user.current_rank || 'None',
      rank_bonus_rate: rankBonusRate
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
