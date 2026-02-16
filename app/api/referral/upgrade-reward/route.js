import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/referral/upgrade-reward
 * Award referral upgrade points to the upline when a referred user upgrades to DAG LIEUTENANT.
 * 
 * Scenarios handled:
 *   Scenario 2: Upline is DAG SOLDIER -> base upgrade bonus (soldier_refers_soldier_upgrade)
 *   Scenario 4: Upline is DAG LIEUTENANT -> base upgrade bonus + 20% LT bonus (bifurcated)
 * 
 * Body: { upgradedUserId }
 */
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { upgradedUserId } = await request.json();

    if (!upgradedUserId) {
      return NextResponse.json(
        { error: 'upgradedUserId is required' },
        { status: 400 }
      );
    }

    // Get the referral record where this user was referred
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('id, referrer_id, referred_id, referral_code, points_earned_on_upgrade, referred_user_upgraded')
      .eq('referred_id', upgradedUserId)
      .single();

    if (fetchError || !referral) {
      // No referral record — user wasn't referred, nothing to do
      return NextResponse.json({
        success: true,
        message: 'No referral record found for this user',
        noReferral: true
      });
    }

    // Skip if already awarded upgrade points
    if (referral.referred_user_upgraded || referral.points_earned_on_upgrade > 0) {
      return NextResponse.json({
        success: true,
        message: 'Upgrade points already awarded',
        alreadyAwarded: true
      });
    }

    // Get referrer's tier and rank
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id, tier, current_rank')
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
      .in('config_key', ['soldier_refers_soldier_upgrade', 'lieutenant_bonus_rate', ...rankBonusKeys]);

    const configMap = {};
    configs?.forEach(c => { configMap[c.config_key] = c.config_value; });

    const baseUpgradeBonus = configMap.soldier_refers_soldier_upgrade || 2500;
    const bonusRate = configMap.lieutenant_bonus_rate || 20;
    const isLieutenant = referrer.tier === 'DAG_LIEUTENANT';

    let totalPointsAwarded = 0;
    const transactions = [];

    // Award base upgrade bonus to referrer
    const { error: baseErr } = await supabase.rpc('add_dag_points', {
      p_user_id: referrer.id,
      p_points: baseUpgradeBonus,
      p_transaction_type: 'referral_upgrade_base',
      p_description: `Referral upgrade bonus - Base (${baseUpgradeBonus} DAG Points) - Referral upgraded to DAG LIEUTENANT`,
      p_reference_id: referral.id
    });
    if (baseErr) console.error('Error awarding base upgrade bonus:', baseErr);
    totalPointsAwarded += baseUpgradeBonus;
    transactions.push({ type: 'referral_upgrade_base', amount: baseUpgradeBonus });

    // If referrer is DAG LIEUTENANT, award 20% bonus as separate transaction
    if (isLieutenant) {
      const bonusAmount = Math.round((baseUpgradeBonus * bonusRate) / 100);
      const { error: bonusErr } = await supabase.rpc('add_dag_points', {
        p_user_id: referrer.id,
        p_points: bonusAmount,
        p_transaction_type: 'referral_upgrade_lieutenant_bonus',
        p_description: `Referral upgrade bonus - ${bonusRate}% Lieutenant Bonus on ${baseUpgradeBonus} (${bonusAmount} DAG Points)`,
        p_reference_id: referral.id
      });
      if (bonusErr) console.error('Error awarding LT upgrade bonus:', bonusErr);
      totalPointsAwarded += bonusAmount;
      transactions.push({ type: 'referral_upgrade_lieutenant_bonus', amount: bonusAmount });
    }

    // If referrer is DAG LIEUTENANT with a rank, award rank bonus on base amount
    if (isLieutenant && referrer.current_rank && referrer.current_rank !== 'None') {
      const rankKey = 'rank_upgrade_bonus_' + referrer.current_rank.toLowerCase();
      const rankBonusRate = configMap[rankKey] || 0;
      if (rankBonusRate > 0) {
        const rankBonusAmount = Math.round((baseUpgradeBonus * rankBonusRate) / 100);
        const { error: rankErr } = await supabase.rpc('add_dag_points', {
          p_user_id: referrer.id,
          p_points: rankBonusAmount,
          p_transaction_type: 'referral_upgrade_rank_bonus',
          p_description: `Referral upgrade bonus - ${rankBonusRate}% ${referrer.current_rank} Rank Bonus on ${baseUpgradeBonus} (${rankBonusAmount} DAG Points)`,
          p_reference_id: referral.id
        });
        if (rankErr) console.error('Error awarding rank upgrade bonus:', rankErr);
        totalPointsAwarded += rankBonusAmount;
        transactions.push({ type: 'referral_upgrade_rank_bonus', amount: rankBonusAmount, rank: referrer.current_rank, rate: rankBonusRate });
      }
    }

    // Update referral record
    const existingTotal = referral.points_earned_on_join || 0;
    await supabase
      .from('referrals')
      .update({
        points_earned_on_upgrade: totalPointsAwarded,
        total_points_earned: existingTotal + totalPointsAwarded,
        referred_user_upgraded: true,
        upgrade_date: new Date().toISOString()
      })
      .eq('id', referral.id);

    return NextResponse.json({
      success: true,
      message: 'Referral upgrade points awarded to upline',
      referrerTier: referrer.tier,
      totalPointsAwarded,
      transactions
    });

  } catch (error) {
    console.error('Exception in referral upgrade-reward API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
