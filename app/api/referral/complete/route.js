import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { notifyReferralCompleted } from '@/services/dagchainWebhook';

/**
 * POST /api/referral/complete
 * Award referral join points to the upline when a new user signs up via referral.
 * 
 * Scenarios handled:
 *   Scenario 1: Upline is DAG SOLDIER -> base join bonus (soldier_refers_soldier_join)
 *   Scenario 3: Upline is DAG LIEUTENANT -> base join bonus + 20% LT bonus (bifurcated)
 * 
 * Body: { referredUserId }
 */
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { referredUserId } = await request.json();

    if (!referredUserId) {
      return NextResponse.json(
        { error: 'referredUserId is required' },
        { status: 400 }
      );
    }

    // Get the referral record for this referred user
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('id, referrer_id, referred_id, referral_code, points_earned_on_join')
      .eq('referred_id', referredUserId)
      .single();

    if (fetchError || !referral) {
      return NextResponse.json(
        { error: 'Referral record not found' },
        { status: 404 }
      );
    }

    // Skip if already awarded join points
    if (referral.points_earned_on_join > 0) {
      return NextResponse.json({
        success: true,
        message: 'Join points already awarded',
        alreadyAwarded: true
      });
    }

    // Get referrer's tier, rank and email
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id, tier, current_rank, email')
      .eq('id', referral.referrer_id)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { error: 'Referrer not found' },
        { status: 404 }
      );
    }

    // Fetch config values (include rank upgrade bonus keys)
    const rankBonusKeys = [
      'rank_upgrade_bonus_initiator','rank_upgrade_bonus_vanguard','rank_upgrade_bonus_guardian',
      'rank_upgrade_bonus_striker','rank_upgrade_bonus_invoker','rank_upgrade_bonus_commander',
      'rank_upgrade_bonus_champion','rank_upgrade_bonus_conqueror','rank_upgrade_bonus_paragon',
      'rank_upgrade_bonus_mythic'
    ];
    const { data: configs } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', ['soldier_refers_soldier_join', 'lieutenant_bonus_rate', ...rankBonusKeys]);

    const configMap = {};
    configs?.forEach(c => { configMap[c.config_key] = c.config_value; });

    const baseJoinBonus = configMap.soldier_refers_soldier_join || 500;
    const bonusRate = configMap.lieutenant_bonus_rate || 20;
    const isLieutenant = referrer.tier === 'DAG_LIEUTENANT';

    let totalPointsAwarded = 0;
    const transactions = [];

    // Award base join bonus to referrer
    const { error: baseErr } = await supabase.rpc('add_dag_points', {
      p_user_id: referrer.id,
      p_points: baseJoinBonus,
      p_transaction_type: 'referral_join_base',
      p_description: `Referral join bonus - Base (${baseJoinBonus} DAG Points)`,
      p_reference_id: referral.id
    });
    if (baseErr) console.error('Error awarding base join bonus:', baseErr);
    totalPointsAwarded += baseJoinBonus;
    transactions.push({ type: 'referral_join_base', amount: baseJoinBonus });

    // If referrer is DAG LIEUTENANT, award 20% bonus as separate transaction
    if (isLieutenant) {
      const bonusAmount = Math.round((baseJoinBonus * bonusRate) / 100);
      const { error: bonusErr } = await supabase.rpc('add_dag_points', {
        p_user_id: referrer.id,
        p_points: bonusAmount,
        p_transaction_type: 'referral_join_lieutenant_bonus',
        p_description: `Referral join bonus - ${bonusRate}% Lieutenant Bonus on ${baseJoinBonus} (${bonusAmount} DAG Points)`,
        p_reference_id: referral.id
      });
      if (bonusErr) console.error('Error awarding LT join bonus:', bonusErr);
      totalPointsAwarded += bonusAmount;
      transactions.push({ type: 'referral_join_lieutenant_bonus', amount: bonusAmount });
    }

    // If referrer has a rank, award rank bonus on base amount (applies to both SOLDIER and LIEUTENANT)
    if (referrer.current_rank && referrer.current_rank !== 'None') {
      const rankKey = 'rank_upgrade_bonus_' + referrer.current_rank.toLowerCase();
      const rankBonusRate = configMap[rankKey] || 0;
      if (rankBonusRate > 0) {
        const rankBonusAmount = Math.round((baseJoinBonus * rankBonusRate) / 100);
        const { error: rankErr } = await supabase.rpc('add_dag_points', {
          p_user_id: referrer.id,
          p_points: rankBonusAmount,
          p_transaction_type: 'referral_join_rank_bonus',
          p_description: `Referral join bonus - ${rankBonusRate}% ${referrer.current_rank} Rank Bonus on ${baseJoinBonus} (${rankBonusAmount} DAG Points)`,
          p_reference_id: referral.id
        });
        if (rankErr) console.error('Error awarding rank join bonus:', rankErr);
        totalPointsAwarded += rankBonusAmount;
        transactions.push({ type: 'referral_join_rank_bonus', amount: rankBonusAmount, rank: referrer.current_rank, rate: rankBonusRate });
      }
    }

    // Update referral record with points earned on join
    await supabase
      .from('referrals')
      .update({
        points_earned_on_join: totalPointsAwarded,
        total_points_earned: totalPointsAwarded
      })
      .eq('id', referral.id);

    // Notify DAGChain — they are the SSO source of truth for referrals (fire-and-forget)
    // Pass emails so DAGChain can match users (DAGARMY users have no wallet, email is the identifier)
    const { data: referredUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', referredUserId)
      .single();
    notifyReferralCompleted(
      { id: referral.referrer_id, email: referrer.email },
      { id: referredUserId, email: referredUser?.email || null },
      referral.referral_code,
      'direct'
    );

    return NextResponse.json({
      success: true,
      message: 'Referral join points awarded',
      referrerTier: referrer.tier,
      totalPointsAwarded,
      transactions
    });

  } catch (error) {
    console.error('Exception in referral complete API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
