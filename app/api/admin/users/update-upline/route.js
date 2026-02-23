import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '@/lib/admin-auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * PUT /api/admin/users/update-upline
 * Change a user's upline (referrer) by providing a new referral code.
 * 
 * Body: { userId, newReferralCode }
 *   - userId: the user whose upline we want to change
 *   - newReferralCode: the referral code of the new upline (e.g. "DAG-XXXXX-YYYY")
 *     Pass empty string or null to remove the upline entirely.
 */
export async function PUT(request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userId, newReferralCode } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Verify the user exists
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, full_name, email')
      .eq('id', userId)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If removing upline
    if (!newReferralCode || newReferralCode.trim() === '') {
      const { error: delErr } = await supabase
        .from('referrals')
        .delete()
        .eq('referred_id', userId);

      if (delErr) {
        return NextResponse.json({ error: 'Failed to remove upline', details: delErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Upline removed successfully',
        userId,
        newReferrer: null
      });
    }

    // Validate the new referral code exists
    const { data: codeData, error: codeErr } = await supabase
      .from('referral_codes')
      .select('user_id, referral_code, is_active')
      .eq('referral_code', newReferralCode.toUpperCase().trim())
      .single();

    if (codeErr || !codeData) {
      return NextResponse.json({ error: 'Invalid referral code. Code not found.' }, { status: 400 });
    }

    if (!codeData.is_active) {
      return NextResponse.json({ error: 'This referral code is inactive.' }, { status: 400 });
    }

    // Prevent self-referral
    if (codeData.user_id === userId) {
      return NextResponse.json({ error: 'Cannot set a user as their own upline.' }, { status: 400 });
    }

    // Get the new referrer's info
    const { data: newReferrer } = await supabase
      .from('users')
      .select('id, full_name, email')
      .eq('id', codeData.user_id)
      .single();

    // Check if user already has a referral record
    const { data: existingRef } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', userId)
      .single();

    if (existingRef) {
      // Update existing referral record
      const { error: updateErr } = await supabase
        .from('referrals')
        .update({
          referrer_id: codeData.user_id,
          referral_code: codeData.referral_code,
          updated_at: new Date().toISOString()
        })
        .eq('referred_id', userId);

      if (updateErr) {
        return NextResponse.json({ error: 'Failed to update upline', details: updateErr.message }, { status: 500 });
      }
    } else {
      // Create new referral record
      const { error: insertErr } = await supabase
        .from('referrals')
        .insert({
          referrer_id: codeData.user_id,
          referred_id: userId,
          referral_code: codeData.referral_code,
          referral_tier: 'DAG_SOLDIER',
          points_earned_on_join: 0,
          points_earned_on_upgrade: 0,
          total_points_earned: 0
        });

      if (insertErr) {
        return NextResponse.json({ error: 'Failed to create upline record', details: insertErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Upline updated successfully',
      userId,
      newReferrer: {
        id: newReferrer?.id,
        name: newReferrer?.full_name || newReferrer?.email,
        email: newReferrer?.email,
        referralCode: codeData.referral_code
      }
    });

  } catch (error) {
    console.error('Error in update-upline API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
