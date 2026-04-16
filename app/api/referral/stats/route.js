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

    // Get referral rows for this referrer
    const { data: referrals, error: refError } = await supabaseAdmin
      .from('referrals')
      .select('id, status, total_points_earned, created_at')
      .eq('referrer_id', userId);

    if (refError) {
      console.error('Error fetching referrals:', refError);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    const rows = referrals || [];
    const total_referrals = rows.length;
    const successful_referrals = rows.filter(r => r.status === 'completed').length;
    const pending_referrals = rows.filter(r => r.status === 'pending').length;
    const last_referral_at = rows.length > 0
      ? rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0].created_at
      : null;

    // Get total points earned from referrals via points_transactions
    const { data: txns } = await supabaseAdmin
      .from('points_transactions')
      .select('points')
      .eq('user_id', userId)
      .in('transaction_type', ['referral_join', 'referral_upgrade']);

    const total_points_earned = (txns || []).reduce((sum, t) => sum + (t.points || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        total_referrals,
        successful_referrals,
        pending_referrals,
        total_points_earned,
        last_referral_at,
      }
    });

  } catch (error) {
    console.error('Exception in stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
