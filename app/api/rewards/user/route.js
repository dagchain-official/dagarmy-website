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
    const wallet = searchParams.get('wallet');

    if (!email && !wallet) {
      return NextResponse.json(
        { error: 'email or wallet is required' },
        { status: 400 }
      );
    }

    // Fetch user data with reward information — prefer email, fall back to wallet
    let userQuery = supabase.from('users').select('*');
    if (email) {
      userQuery = userQuery.eq('email', email);
    } else {
      userQuery = userQuery.eq('wallet_address', wallet.toLowerCase());
    }
    const { data: user, error: userError } = await userQuery.single();

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
      .eq('payment_status', 'paid');

    const totalUsdEarned = commissions?.reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0) || 0;

    // Get USDT earned from DAGChain webhook data (stored in dagchain_data JSONB)
    const totalUsdtEarned = parseFloat(user.dagchain_data?.usdt_earned || 0);

    // Current month direct sales (for Discretionary + Lifestyle pools)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { data: monthSales } = await supabase
      .from('sales_commissions')
      .select('sale_amount')
      .eq('user_id', user.id)
      .eq('commission_level', 1)
      .gte('created_at', monthStart);
    const monthDirectSales = monthSales?.reduce((sum, c) => sum + parseFloat(c.sale_amount || 0), 0) || 0;

    // Current quarter direct sales (for Executive pool)
    const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
    const quarterStart = new Date(now.getFullYear(), quarterMonth, 1).toISOString();
    const { data: quarterSales } = await supabase
      .from('sales_commissions')
      .select('sale_amount')
      .eq('user_id', user.id)
      .eq('commission_level', 1)
      .gte('created_at', quarterStart);
    const quarterDirectSales = quarterSales?.reduce((sum, c) => sum + parseFloat(c.sale_amount || 0), 0) || 0;

    // Incentive pool config
    const { data: incentiveConfig } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', [
        'incentive_discretionary_pool_pct', 'incentive_discretionary_sales_threshold', 'incentive_discretionary_enabled',
        'incentive_lifestyle_pool_pct', 'incentive_lifestyle_sales_threshold', 'incentive_lifestyle_enabled',
        'incentive_executive_pool_pct', 'incentive_executive_sales_threshold', 'incentive_executive_enabled',
      ]);
    const ic = {};
    (incentiveConfig || []).forEach(r => { ic[r.config_key] = r.config_value; });

    // Compute all point stats live from transactions (avoids stale stored columns)
    const { data: allTxs } = await supabase
      .from('points_transactions')
      .select('points, transaction_type')
      .eq('user_id', user.id);

    let totalPointsEarnedLive = 0;
    let totalPointsBurned = 0;
    let totalPointsRedeemed = 0;
    (allTxs || []).forEach(t => {
      if (t.points > 0) {
        totalPointsEarnedLive += t.points;
      } else {
        if (t.transaction_type === 'rank_burn') totalPointsBurned += Math.abs(t.points);
        else totalPointsRedeemed += Math.abs(t.points);
      }
    });
    const availablePoints = totalPointsEarnedLive - totalPointsBurned - totalPointsRedeemed;

    // Get ranking system config for DAG SOLDIER
    const { data: rankingConfig } = await supabase
      .from('rewards_config')
      .select('config_value')
      .eq('config_key', 'ranking_system_enabled_for_soldier')
      .single();

    const rankingEnabledForSoldier = rankingConfig?.config_value === 1;

    // Fetch last 50 points transactions for history
    const { data: pointsTxs } = await supabase
      .from('points_transactions')
      .select('id, transaction_id, points, transaction_type, description, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Fetch USD commission transactions (all statuses — admin grants included)
    const { data: usdTxs } = await supabase
      .from('sales_commissions')
      .select('id, sale_id, commission_amount, payment_status, product_name, product_type, commission_level, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Normalise USD rows to the same shape as points rows
    const normalisedUsd = (usdTxs || []).map(c => {
      const isAdminGrant = c.product_type === 'ADMIN_GRANT';
      const desc = isAdminGrant
        ? `Admin grant: ${c.product_name || 'USD credit'}`
        : c.product_name || `Level ${c.commission_level} commission`;
      return {
        id: `usd_${c.id}`,
        transaction_id: c.sale_id || null,
        points: null,
        amount: parseFloat(c.commission_amount || 0),
        transaction_type: 'usd_commission',
        description: desc,
        payment_status: c.payment_status,
        created_at: c.created_at,
      };
    });

    // Merge and sort by date descending, cap at 100
    const txHistory = [...(pointsTxs || []), ...normalisedUsd]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 100);

    // Return user reward data
    return NextResponse.json({
      success: true,
      data: {
        currentRank: user.current_rank || 'None',
        dagPoints: availablePoints,
        totalReferrals: referralCount || 0,
        usdEarned: totalUsdEarned,
        usdtEarned: totalUsdtEarned,
        referralCode: referralCodeData || '',
        tier: user.tier || 'DAG SOLDIER',
        totalPointsEarned: user.total_points_earned || 0,
        totalPointsBurned,
        totalPointsRedeemed,
        rankingEnabledForSoldier: rankingEnabledForSoldier,
        txHistory: txHistory || [],
        monthDirectSales,
        quarterDirectSales,
        incentivePools: {
          discretionary: {
            enabled: parseInt(ic.incentive_discretionary_enabled ?? 1) === 1,
            poolPct: parseFloat(ic.incentive_discretionary_pool_pct ?? 3),
            threshold: parseFloat(ic.incentive_discretionary_sales_threshold ?? 1000),
            currentSales: monthDirectSales,
            period: 'monthly',
          },
          lifestyle: {
            enabled: parseInt(ic.incentive_lifestyle_enabled ?? 1) === 1,
            poolPct: parseFloat(ic.incentive_lifestyle_pool_pct ?? 3),
            threshold: parseFloat(ic.incentive_lifestyle_sales_threshold ?? 2000),
            currentSales: monthDirectSales,
            period: 'monthly',
          },
          executive: {
            enabled: parseInt(ic.incentive_executive_enabled ?? 1) === 1,
            poolPct: parseFloat(ic.incentive_executive_pool_pct ?? 2),
            threshold: parseFloat(ic.incentive_executive_sales_threshold ?? 10000),
            currentSales: quarterDirectSales,
            period: 'quarterly',
          },
        },
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


