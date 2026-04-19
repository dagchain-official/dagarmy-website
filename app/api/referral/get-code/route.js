import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/referral/get-code
 * Get or create referral code for the authenticated user
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Check if this is a DAGChain user with their own referral code
    const { data: userRow } = await supabaseAdmin
      .from('users')
      .select('dagchain_referral_code, auth_provider')
      .eq('id', userId)
      .maybeSingle();

    // DAGChain users use their dagchain_referral_code as their canonical code
    if (userRow?.dagchain_referral_code) {
      return NextResponse.json({
        success: true,
        code: userRow.dagchain_referral_code,
        source: 'dagchain',
      });
    }

    // DAGARMY native users - get or create their generated referral code
    const { data: referralCode, error } = await supabaseAdmin.rpc('get_or_create_referral_code', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error getting referral code:', error);
      return NextResponse.json(
        { error: 'Failed to get referral code', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code: referralCode,
      source: 'dagarmy',
    });

  } catch (error) {
    console.error('Exception in get-code API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
