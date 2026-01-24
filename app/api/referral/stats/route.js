import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/referral/stats
 * Get referral statistics for the authenticated user
 */
export async function GET(request) {
  try {
    // Get user ID from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get referral stats from database
    const { data: stats, error: statsError } = await supabaseAdmin
      .from('referral_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      console.error('Error fetching referral stats:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch stats', details: statsError.message },
        { status: 500 }
      );
    }

    // If no stats exist yet, return default values
    if (!stats) {
      return NextResponse.json({
        success: true,
        stats: {
          total_referrals: 0,
          successful_referrals: 0,
          pending_referrals: 0,
          total_points_earned: 0,
          last_referral_at: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Exception in stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
