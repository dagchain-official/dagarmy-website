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

    // Validate the referral code
    const { data: codeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('user_id, is_active')
      .eq('referral_code', referralCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Prevent self-referrals
    if (codeData.user_id === userId) {
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
      .single();

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
        referrer_id: codeData.user_id,
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
