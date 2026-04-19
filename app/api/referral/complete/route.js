import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { notifyReferralCompleted } from '@/services/dagchainWebhook';

/**
 * POST /api/referral/complete
 * Award referral JOIN points to the upline when a new user signs up via referral.
 *
 * New Tier-based rules (rank system removed):
 *   Referrer = DAG SOLDIER  → +500 pts  (soldier_refers_join)
 *   Referrer = DAG LIEUTENANT → +1000 pts (lieutenant_refers_join)
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

    // Idempotency guard - skip if already awarded
    if (referral.points_earned_on_join > 0) {
      return NextResponse.json({
        success: true,
        message: 'Join points already awarded',
        alreadyAwarded: true,
      });
    }

    // Get referrer's tier
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id, tier, email')
      .eq('id', referral.referrer_id)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { error: 'Referrer not found' },
        { status: 404 }
      );
    }

    // Fetch tier-based config values
    const { data: configs } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', ['soldier_refers_join', 'lieutenant_refers_join']);

    const configMap = {};
    configs?.forEach(c => { configMap[c.config_key] = c.config_value; });

    const isLieutenant =
      referrer.tier === 'DAG_LIEUTENANT' || referrer.tier === 'DAG LIEUTENANT';

    // Determine the single bonus amount based on referrer's tier
    const bonusAmount = isLieutenant
      ? (configMap.lieutenant_refers_join ?? 1000)
      : (configMap.soldier_refers_join ?? 500);

    const tierLabel = isLieutenant ? 'DAG LIEUTENANT' : 'DAG SOLDIER';

    // Award join bonus to referrer (single transaction, no splits)
    const { error: awardErr } = await supabase.rpc('add_dag_points', {
      p_user_id: referrer.id,
      p_points: bonusAmount,
      p_transaction_type: 'referral_join',
      p_description: `Referral join bonus - ${tierLabel} referrer (+${bonusAmount} DAG Points)`,
      p_reference_id: referral.id,
    });

    if (awardErr) {
      console.error('Error awarding referral join bonus:', awardErr);
      return NextResponse.json(
        { error: 'Failed to award referral join bonus', details: awardErr.message },
        { status: 500 }
      );
    }

    // Update referral record
    await supabase
      .from('referrals')
      .update({
        status: 'completed',
        points_earned_on_join: bonusAmount,
        total_points_earned: bonusAmount,
        completed_at: new Date().toISOString(),
      })
      .eq('id', referral.id);

    // Notify DAGChain (fire-and-forget)
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
      bonusAmount,
    });

  } catch (error) {
    console.error('Exception in referral complete API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
