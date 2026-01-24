import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/referral/get-code
 * Get or create referral code for the authenticated user
 */
export async function GET(request) {
  try {
    // Get user ID from query params or headers
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Call database function to get or create referral code
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
      code: referralCode
    });

  } catch (error) {
    console.error('Exception in get-code API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
