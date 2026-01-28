import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch user data with reward information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get or create referral code from referral_codes table
    const { data: referralCodeData } = await supabase
      .rpc('get_or_create_referral_code', { p_user_id: user.id });

    // Get referral count
    const { count: referralCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id);

    // Get total USD earned from sales commissions
    const { data: commissions } = await supabase
      .from('sales_commissions')
      .select('commission_amount')
      .eq('user_id', user.id)
      .eq('status', 'paid');

    const totalUsdEarned = commissions?.reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0) || 0;

    // Calculate available points (earned - burned)
    const availablePoints = (user.total_points_earned || 0) - (user.total_points_burned || 0);

    // Get ranking system config for DAG SOLDIER
    const { data: rankingConfig } = await supabase
      .from('rewards_config')
      .select('config_value')
      .eq('config_key', 'ranking_system_enabled_for_soldier')
      .single();

    const rankingEnabledForSoldier = rankingConfig?.config_value === 1;

    // Return user reward data
    return NextResponse.json({
      success: true,
      data: {
        currentRank: user.current_rank || 'None',
        dagPoints: availablePoints,
        totalReferrals: referralCount || 0,
        usdEarned: totalUsdEarned,
        referralCode: referralCodeData || '',
        tier: user.tier || 'DAG SOLDIER',
        totalPointsEarned: user.total_points_earned || 0,
        totalPointsBurned: user.total_points_burned || 0,
        rankingEnabledForSoldier: rankingEnabledForSoldier
      }
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user rewards', details: error.message },
      { status: 500 }
    );
  }
}
