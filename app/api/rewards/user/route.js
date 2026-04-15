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

    // ── 6. Spend-based pts rate + DGCC ratio (for display in UI) ────────────
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
        'dgcc_points_ratio',
      ]);

    const sc = {};
    (spendCfg || []).forEach(r => { sc[r.config_key] = parseFloat(r.config_value); });

    const dgccRatio = sc.dgcc_points_ratio || 2500;

    const spendPtsRate       = isLieutenant ? (sc.spend_pts_per_dollar_lieutenant ?? 50) : (sc.spend_pts_per_dollar_soldier ?? 25);
    const l1CommissionPct    = isLieutenant ? (sc.lieutenant_l1_commission_pct ?? 20) : (sc.soldier_l1_commission_pct ?? 15);
    const taskMultiplier     = isLieutenant ? (sc.task_multiplier_lieutenant ?? 2) : 1;

    // ── 7. Ecosystem spend (for Fortune 500 eligibility) ────────────────────
    // Sum up all purchases: validator nodes, storage nodes, LT upgrade, DAGGPT credits
    const { data: ecosystemPurchases } = await supabase
      .from('sales_commissions')
      .select('sale_amount')
      .eq('user_id', user.id)
      .in('product_type', ['VALIDATOR_NODE', 'STORAGE_NODE', 'LT_UPGRADE', 'DAGGPT_CREDIT', 'dag_soldier_upgrade', 'dag_lieutenant_upgrade']);

    // Also sum from points_transactions of type 'purchase' or 'node_purchase'
    const { data: purchaseTxs } = await supabase
      .from('points_transactions')
      .select('points, transaction_type')
      .eq('user_id', user.id)
      .in('transaction_type', ['node_purchase', 'validator_node', 'storage_node', 'daggpt_credit', 'lt_upgrade']);

    const ecosystemSpend = (ecosystemPurchases || []).reduce(
      (sum, p) => sum + parseFloat(p.sale_amount || 0), 0
    );

    // ── 8. Fortune 500 pool data ────────────────────────────────────────────
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

    const { data: f500Dist } = await supabase
      .from('fortune500_distributions')
      .select('pool_amount, member_count, per_member_amount, status, period')
      .eq('status', 'distributed')
      .order('period', { ascending: false })
      .limit(1)
      .single();

    const { count: f500MemberCount } = await supabase
      .from('fortune500_members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Fortune 500 eligibility: enrolled + $500 ecosystem spend
    const f500Eligible = !!f500Member?.is_active && ecosystemSpend >= 500;

    // ── 9. DAG LT Pool data ─────────────────────────────────────────────────
    const { data: ltPoolMember } = await supabase
      .from('dag_lt_pool_members')
      .select('id, is_active, qualified_at')
      .eq('user_id', user.id)
      .single();

    const { count: ltPoolMemberCount } = await supabase
      .from('dag_lt_pool_members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { data: ltPoolDist } = await supabase
      .from('dag_lt_pool_distributions')
      .select('pool_amount, member_count, per_member_amount, status, period')
      .eq('status', 'distributed')
      .order('period', { ascending: false })
      .limit(1)
      .single();

    // Count direct referrals who upgraded to LT within 30 days of the user's own upgrade
    let directLtUpgrades = 0;
    let daysLeft = null;
    let ltUpgradedAt = null;

    if (isLieutenant) {
      // Find the user's own upgrade date from points_transactions
      const { data: selfUpgradeTx } = await supabase
        .from('points_transactions')
        .select('created_at')
        .eq('user_id', user.id)
        .eq('transaction_type', 'lieutenant_upgrade')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      ltUpgradedAt = selfUpgradeTx?.created_at || user.upgraded_at || null;

      if (ltUpgradedAt) {
        const upgradeDate = new Date(ltUpgradedAt);
        const windowEnd = new Date(upgradeDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const now = new Date();
        daysLeft = Math.max(0, Math.ceil((windowEnd - now) / (1000 * 60 * 60 * 24)));

        // Count direct referrals who upgraded to LT within the 30-day window
        const { data: directRefs } = await supabase
          .from('referrals')
          .select('referred_id')
          .eq('referrer_id', user.id);

        if (directRefs?.length) {
          const refIds = directRefs.map(r => r.referred_id);
          const { data: ltUpgrades } = await supabase
            .from('points_transactions')
            .select('user_id, created_at')
            .in('user_id', refIds)
            .eq('transaction_type', 'lieutenant_upgrade')
            .gte('created_at', upgradeDate.toISOString())
            .lte('created_at', windowEnd.toISOString());

          // Unique referred users who upgraded to LT in the window
          const uniqueUpgrades = new Set((ltUpgrades || []).map(t => t.user_id));
          directLtUpgrades = uniqueUpgrades.size;
        }
      }
    }

    const ltPoolEligible = !!ltPoolMember?.is_active;

    // ── 10. Elite Pool data ──────────────────────────────────────────────────
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
        dgccBalance: user.dgcc_balance || 0,
        dgccRatio,
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

        // Ecosystem spend (for Fortune 500 eligibility display)
        ecosystemSpend,

        // Incentive Pools (all 3)
        incentivePools: {
          fortune500: {
            isEligible: f500Eligible,
            enrolled: !!f500Member?.is_active,
            enrolledAt: f500Member?.enrolled_at || null,
            enrollmentOpen: parseInt(f5cfg.fortune500_enrollment_open ?? 1) === 1,
            poolPct: parseFloat(f5cfg.fortune500_pool_pct ?? 10),
            activeMemberCount: f500MemberCount || 0,
            lastPayoutAmount: f500Dist?.per_member_amount ? parseFloat(f500Dist.per_member_amount) : null,
            lastPayoutPeriod: f500Dist?.period || null,
          },
          dag_lt_pool: {
            isEligible: ltPoolEligible,
            enrolled: !!ltPoolMember?.is_active,
            qualifiedAt: ltPoolMember?.qualified_at || null,
            activeMemberCount: ltPoolMemberCount || 0,
            lastPayoutAmount: ltPoolDist?.per_member_amount ? parseFloat(ltPoolDist.per_member_amount) : null,
            lastPayoutPeriod: ltPoolDist?.period || null,
            directLtUpgrades,
            daysLeft,
            upgradedAt: ltUpgradedAt,
          },
          elite: {
            isEligible: isLieutenant,
            active: parseInt(ec.elite_pool_active ?? 0) === 1,
            blockchainPct: parseFloat(ec.elite_pool_blockchain_pct ?? 50),
            totalLtMembers: ltMemberCount || 0,
          },
        },

        // Transaction history
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
