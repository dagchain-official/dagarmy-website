import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/referral/track
 * Track a referral when a new user signs up with a referral code
 */
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { referralCode, userId } = await request.json();

    if (!referralCode || !userId) {
      return NextResponse.json(
        { error: 'Referral code and user ID are required' },
        { status: 400 }
      );
    }

    // Validate the referral code — look up in users.referral_code (primary source of truth)
    const { data: referrer, error: codeError } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode.toUpperCase())
      .single();

    if (codeError || !referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Prevent self-referrals
    if (referrer.id === userId) {
      return NextResponse.json(
        { error: 'Cannot refer yourself' },
        { status: 400 }
      );
    }

    // Check if user has already been referred
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', userId)
      .maybeSingle();

    if (existingReferral) {
      return NextResponse.json(
        { error: 'User has already been referred' },
        { status: 400 }
      );
    }

    // Create referral record
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referred_id: userId,
        referral_code: referralCode.toUpperCase(),
        status: 'pending',
        reward_points: 0
      });

    if (insertError) {
      console.error('Error tracking referral:', insertError);
      return NextResponse.json(
        { error: 'Failed to track referral', details: insertError.message },
        { status: 500 }
      );
    }

    // Update referred user's referred_by_user_id field
    await supabase
      .from('users')
      .update({ referred_by_user_id: referrer.id })
      .eq('id', userId);

    return NextResponse.json({
      success: true,
      message: 'Referral tracked successfully'
    });

  } catch (error) {
    console.error('Exception in track API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
