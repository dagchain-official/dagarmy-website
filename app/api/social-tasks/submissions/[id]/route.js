import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PUT - Admin approve/reject a submission
export async function PUT(request, { params }) {
  try {
    const supabase = supabaseAdmin;
    const { id } = await params;
    const body = await request.json();
    const { user_email, status, admin_notes } = body;

    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status must be approved or rejected' }, { status: 400 });
    }

    // Verify admin
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id, is_master_admin, role')
      .eq('email', user_email)
      .single();

    if (adminError || (!adminUser?.is_master_admin && adminUser?.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // Get submission with task info
    const { data: submission, error: subError } = await supabase
      .from('social_task_submissions')
      .select('*, task:social_tasks(points)')
      .eq('id', id)
      .single();

    if (subError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.status !== 'pending') {
      return NextResponse.json({ error: `Submission already ${submission.status}` }, { status: 400 });
    }

    let pointsAwarded = 0;

    if (status === 'approved') {
      const basePoints = submission.task.points;

      // Check if user is DAG LIEUTENANT and get rank
      const { data: submitter } = await supabase
        .from('users')
        .select('id, tier, current_rank')
        .eq('id', submission.user_id)
        .single();

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
      const isLT = submitter?.tier === 'DAG_LIEUTENANT';

      // 1. Award base points
      const { error: baseErr } = await supabase.rpc('add_dag_points', {
        p_user_id: submission.user_id,
        p_points: basePoints,
        p_transaction_type: 'social_task_base',
        p_description: `Social task base: ${basePoints} DAG Points`,
        p_reference_id: id
      });
      if (baseErr) { console.error('Error awarding base social task points:', baseErr); throw baseErr; }
      pointsAwarded += basePoints;

      // 2. If DAG LIEUTENANT, award LT bonus as separate transaction
      if (isLT) {
        const ltBonus = Math.round((basePoints * ltBonusRate) / 100);
        const { error: ltErr } = await supabase.rpc('add_dag_points', {
          p_user_id: submission.user_id,
          p_points: ltBonus,
          p_transaction_type: 'social_task_lt_bonus',
          p_description: `Social task - ${ltBonusRate}% Lieutenant Bonus on ${basePoints} (${ltBonus} DAG Points)`,
          p_reference_id: id
        });
        if (ltErr) console.error('Error awarding LT social task bonus:', ltErr);
        pointsAwarded += ltBonus;
      }

      // 3. If ranked DAG LIEUTENANT, award rank bonus on base
      if (isLT && submitter?.current_rank && submitter.current_rank !== 'None') {
        const rankKey = 'rank_upgrade_bonus_' + submitter.current_rank.toLowerCase();
        const rankBonusRate = configMap[rankKey] || 0;
        if (rankBonusRate > 0) {
          const rankBonus = Math.round((basePoints * rankBonusRate) / 100);
          const { error: rankErr } = await supabase.rpc('add_dag_points', {
            p_user_id: submission.user_id,
            p_points: rankBonus,
            p_transaction_type: 'social_task_rank_bonus',
            p_description: `Social task - ${rankBonusRate}% ${submitter.current_rank} Rank Bonus on ${basePoints} (${rankBonus} DAG Points)`,
            p_reference_id: id
          });
          if (rankErr) console.error('Error awarding rank social task bonus:', rankErr);
          pointsAwarded += rankBonus;
        }
      }
    }

    // Update submission
    const { data: updated, error: updateError } = await supabase
      .from('social_task_submissions')
      .update({
        status,
        admin_notes: admin_notes || null,
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
        points_awarded: pointsAwarded,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      submission: updated,
      points_awarded: pointsAwarded,
      message: status === 'approved'
        ? `Approved! ${pointsAwarded} DAG Points awarded.`
        : 'Submission rejected.'
    }, { status: 200 });
  } catch (error) {
    console.error('Error reviewing submission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
