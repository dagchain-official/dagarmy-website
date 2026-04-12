import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email  = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'userId or email is required' },
        { status: 400 }
      );
    }

    // Fetch user
    let userQuery = supabase.from('users').select('*');
    if (userId) userQuery = userQuery.eq('id', userId);
    else         userQuery = userQuery.eq('email', email);

    const { data: user, error: userError } = await userQuery.single();
    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isLieutenant =
      user.tier === 'DAG_LIEUTENANT' || user.tier === 'DAG LIEUTENANT';

    // ── 1. Referral code ────────────────────────────────────────────────────
    const { data: referralCodeData } = await supabase
      .rpc('get_or_create_referral_code', { p_user_id: user.id });

    // ── 2. Referral count ───────────────────────────────────────────────────
    const { count: referralCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id);

    // ── 3. USD earned (paid commissions only) ───────────────────────────────
    const { data: commissions } = await supabase
      .from('sales_commissions')
      .select('commission_amount')
      .eq('user_id', user.id)
      .eq('payment_status', 'paid');

    const totalUsdEarned =
      commissions?.reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0) || 0;

    // ── 4. USDT earned ──────────────────────────────────────────────────────
    const totalUsdtEarned = parseFloat(user.dagchain_data?.usdt_earned || 0);

    // ── 5. DAG Points — live calculation from points_transactions ───────────
    const { data: allTxs } = await supabase
      .from('points_transactions')
      .select('points, transaction_type')
      .eq('user_id', user.id);

    let totalPointsEarnedLive  = 0;
    let totalPointsBurned      = 0; // rank_burn only (refunded via migration 054)
    let totalPointsRedeemed    = 0;

    (allTxs || []).forEach(t => {
      if (t.points > 0) {
        totalPointsEarnedLive += t.points;
      } else {
        if (t.transaction_type === 'rank_burn') totalPointsBurned  += Math.abs(t.points);
        else                                     totalPointsRedeemed += Math.abs(t.points);
      }
    });

    const availablePoints = totalPointsEarnedLive - totalPointsBurned - totalPointsRedeemed;

    // ── 6. Spend-based pts rate (for display in UI) ──────────────────────
    const { data: spendCfg } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', [
        'spend_pts_per_dollar_soldier',
        'spend_pts_per_dollar_lieutenant',
        'soldier_l1_commission_pct',
        'lieutenant_l1_commission_pct',
        'l2_commission_pct',
        'l3_commission_pct',
        'task_multiplier_lieutenant',
      ]);

    const sc = {};
    (spendCfg || []).forEach(r => { sc[r.config_key] = parseFloat(r.config_value); });

    const spendPtsRate       = isLieutenant ? (sc.spend_pts_per_dollar_lieutenant ?? 50) : (sc.spend_pts_per_dollar_soldier ?? 25);
    const l1CommissionPct    = isLieutenant ? (sc.lieutenant_l1_commission_pct ?? 20) : (sc.soldier_l1_commission_pct ?? 15);
    const taskMultiplier     = isLieutenant ? (sc.task_multiplier_lieutenant ?? 2) : 1;

    // ── 7. Fortune 500 pool data ────────────────────────────────────────────
    const { data: f500Member } = await supabase
      .from('fortune500_members')
      .select('id, enrolled_at, is_active')
      .eq('user_id', user.id)
      .single();

    const { data: f500Config } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', ['fortune500_enrollment_open', 'fortune500_pool_pct']);

    const f5cfg = {};
    (f500Config || []).forEach(r => { f5cfg[r.config_key] = r.config_value; });

    // Current month pending or latest distribution
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const { data: f500Dist } = await supabase
      .from('fortune500_distributions')
      .select('pool_amount, member_count, per_member_amount, status, period')
      .order('period', { ascending: false })
      .limit(1)
      .single();

    const { count: f500MemberCount } = await supabase
      .from('fortune500_members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // ── 8. Elite Pool data ──────────────────────────────────────────────────
    const { data: eliteConfig } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', ['elite_pool_active', 'elite_pool_blockchain_pct']);

    const ec = {};
    (eliteConfig || []).forEach(r => { ec[r.config_key] = r.config_value; });

    const { count: ltMemberCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('tier', ['DAG_LIEUTENANT', 'DAG LIEUTENANT']);

    // ── 9. Transaction history (last 100, all types) ────────────────────────
    const { data: pointsTxs } = await supabase
      .from('points_transactions')
      .select('id, transaction_id, points, transaction_type, description, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(60);

    const { data: usdTxs } = await supabase
      .from('sales_commissions')
      .select('id, sale_id, commission_amount, payment_status, product_name, product_type, commission_level, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(40);

    const normalisedUsd = (usdTxs || []).map(c => {
      const isAdminGrant = c.product_type === 'ADMIN_GRANT';
      const desc = isAdminGrant
        ? `Admin grant: ${c.product_name || 'USD credit'}`
        : `${c.product_name || 'Product'} — Level ${c.commission_level} commission`;
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

    const txHistory = [...(pointsTxs || []), ...normalisedUsd]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 100);

    // ── Response ────────────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      data: {
        // Core
        dagPoints: Math.max(availablePoints, 0),
        tier: user.tier || 'DAG_SOLDIER',
        isLieutenant,
        referralCode: referralCodeData || '',
        totalReferrals: referralCount || 0,

        // Earnings
        usdEarned: totalUsdEarned,
        usdtEarned: totalUsdtEarned,

        // Points summary
        totalPointsEarned: totalPointsEarnedLive,
        totalPointsBurned,   // legacy (should be 0 after migration 054 refund)
        totalPointsRedeemed,

        // Rates (for display)
        spendPtsRate,
        l1CommissionPct,
        l2CommissionPct: sc.l2_commission_pct ?? 3,
        l3CommissionPct: sc.l3_commission_pct ?? 2,
        taskMultiplier,

        // Fortune 500 Pool
        fortune500: {
          enrolled: !!f500Member?.is_active,
          enrolledAt: f500Member?.enrolled_at || null,
          enrollmentOpen: parseInt(f5cfg.fortune500_enrollment_open ?? 1) === 1,
          poolPct: parseFloat(f5cfg.fortune500_pool_pct ?? 10),
          totalMembers: f500MemberCount || 0,
          latestDistribution: f500Dist ? {
            period: f500Dist.period,
            poolAmount: parseFloat(f500Dist.pool_amount || 0),
            perMemberAmount: parseFloat(f500Dist.per_member_amount || 0),
            status: f500Dist.status,
          } : null,
        },

        // Elite Pool
        elitePool: {
          eligible: isLieutenant,
          active: parseInt(ec.elite_pool_active ?? 0) === 1,
          blockchainPct: parseFloat(ec.elite_pool_blockchain_pct ?? 50),
          totalLtMembers: ltMemberCount || 0,
        },

        // Transaction history (no rank data)
        txHistory,
      },
    });

  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user rewards', details: error.message },
      { status: 500 }
    );
  }
}
