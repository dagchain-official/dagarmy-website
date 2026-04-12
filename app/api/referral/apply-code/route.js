import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/referral/apply-code
 * Allows a user to add a referral code after signup (if they didn't enter one during profile completion).
 * - Validates the code exists and is active
 * - Prevents self-referral
 * - Prevents applying if user already has a referral
 * - Once applied, creates referrals row + awards join points to upline
 * Body: { userId, referralCode }
 */
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { userId, referralCode } = await request.json();

    if (!userId || !referralCode) {
      return NextResponse.json(
        { error: 'User ID and referral code are required' },
        { status: 400 }
      );
    }

    const normalizedCode = referralCode.trim().toUpperCase();

    // 1. Validate the referral code exists and is active
    const { data: codeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('user_id, is_active')
      .eq('referral_code', normalizedCode)
      .eq('is_active', true)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json(
        { error: 'Invalid referral code. Please check and try again.' },
        { status: 400 }
      );
    }

    // 2. Prevent self-referral
    if (codeData.user_id === userId) {
      return NextResponse.json(
        { error: 'You cannot use your own referral code.' },
        { status: 400 }
      );
    }

    // 3. Check if user already has a referral
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', userId)
      .maybeSingle();

    if (existingReferral) {
      return NextResponse.json(
        { error: 'You have already applied a referral code. This cannot be changed.' },
        { status: 400 }
      );
    }

    // 4. Get referrer details for response
    const { data: referrer } = await supabase
      .from('users')
      .select('id, full_name, email')
      .eq('id', codeData.user_id)
      .single();

    // 5. Create the referral record
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: codeData.user_id,
        referred_id: userId,
        referral_code: normalizedCode,
        status: 'pending',
        reward_points: 0,
      });

    if (insertError) {
      console.error('Error creating referral:', insertError);
      return NextResponse.json(
        { error: 'Failed to apply referral code. Please try again.' },
        { status: 500 }
      );
    }

    // 6. Award join points to upline (fire-and-forget)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dagarmy.network';
    fetch(`${baseUrl}/api/referral/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referredUserId: userId }),
    }).catch(err => console.error('referral/complete failed (non-blocking):', err));

    return NextResponse.json({
      success: true,
      message: 'Referral code applied successfully!',
      referrer: {
        name: referrer?.full_name || referrer?.email?.split('@')[0] || 'Unknown',
      },
    });

  } catch (error) {
    console.error('Exception in apply-code API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
