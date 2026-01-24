import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/referral/complete
 * Complete a referral and award rewards
 * Called when a referred user completes onboarding/first action
 */
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get the referral record
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('id, referrer_id, referred_id, status')
      .eq('referred_id', userId)
      .eq('status', 'pending')
      .single();

    if (fetchError || !referral) {
      return NextResponse.json(
        { error: 'Referral not found or already completed' },
        { status: 404 }
      );
    }

    const REFERRER_REWARD = 100; // DAG Points for referrer
    const REFERRED_REWARD = 50;  // DAG Points for referred user

    // Update referral status to completed
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', referral.id);

    if (updateError) {
      console.error('Error completing referral:', updateError);
      return NextResponse.json(
        { error: 'Failed to complete referral', details: updateError.message },
        { status: 500 }
      );
    }

    // Award points to referrer
    const { error: referrerRewardError } = await supabase
      .from('referral_rewards')
      .insert({
        user_id: referral.referrer_id,
        referral_id: referral.id,
        reward_type: 'points',
        reward_value: REFERRER_REWARD,
        reward_description: 'Referral bonus for inviting a friend'
      });

    if (referrerRewardError) {
      console.error('Error awarding referrer reward:', referrerRewardError);
    }

    // Award points to referred user
    const { error: referredRewardError } = await supabase
      .from('referral_rewards')
      .insert({
        user_id: referral.referred_id,
        referral_id: referral.id,
        reward_type: 'points',
        reward_value: REFERRED_REWARD,
        reward_description: 'Welcome bonus for joining via referral'
      });

    if (referredRewardError) {
      console.error('Error awarding referred reward:', referredRewardError);
    }

    // Update referral status to rewarded
    const { error: rewardedError } = await supabase
      .from('referrals')
      .update({
        status: 'rewarded',
        reward_points: REFERRER_REWARD
      })
      .eq('id', referral.id);

    if (rewardedError) {
      console.error('Error updating referral to rewarded:', rewardedError);
    }

    return NextResponse.json({
      success: true,
      message: 'Referral completed and rewards awarded',
      rewards: {
        referrer: REFERRER_REWARD,
        referred: REFERRED_REWARD
      }
    });

  } catch (error) {
    console.error('Exception in complete API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
