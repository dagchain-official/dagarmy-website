import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/referral/upgrade-reward
 * Called by Stripe webhook after a user upgrades to DAG LIEUTENANT.
 * Awards ALL three referrer benefits simultaneously:
 *   1. Referral upgrade bonus  (500 pts if referrer = Soldier, 1000 pts if LT)
 *   2. Spend-based DAG Points  ($149 × 25 if Soldier, $149 × 50 if LT)
 *   3. USD commission           ($149 × 15% if Soldier, $149 × 20% if LT)
 *
 * Also cascades L2 and L3 USD commissions up the referral tree.
 *
 * Body: { upgradedUserId, amountPaidUsd? }
 */

const UPGRADE_PRICE_USD = 149;

export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { upgradedUserId, amountPaidUsd = UPGRADE_PRICE_USD } = await request.json();

    if (!upgradedUserId) {
      return NextResponse.json(
        { error: 'upgradedUserId is required' },
        { status: 400 }
      );
    }

    // Get the referral record (L1 referrer)
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('id, referrer_id, referred_id, points_earned_on_upgrade, referred_user_upgraded')
      .eq('referred_id', upgradedUserId)
      .single();

    if (fetchError || !referral) {
      // No referral - user joined organically, nothing to award
      return NextResponse.json({
        success: true,
        message: 'No referral record found - no upline to reward',
        noReferral: true,
      });
    }

    // Idempotency guard
    if (referral.referred_user_upgraded && referral.points_earned_on_upgrade > 0) {
      return NextResponse.json({
        success: true,
        message: 'Upgrade points already awarded',
        alreadyAwarded: true,
      });
    }

    // Load config values
    const { data: configs } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', [
        'soldier_refers_upgrade',
        'lieutenant_refers_upgrade',
        'spend_pts_per_dollar_soldier',
        'spend_pts_per_dollar_lieutenant',
        'soldier_l1_commission_pct',
        'lieutenant_l1_commission_pct',
        'l2_commission_pct',
        'l3_commission_pct',
      ]);

    const cfg = {};
    configs?.forEach(c => { cfg[c.config_key] = parseFloat(c.config_value); });

    // ── L1 Referrer ────────────────────────────────────────────────────────
    const { data: l1Referrer } = await supabase
      .from('users')
      .select('id, tier, email, referred_by_user_id')
      .eq('id', referral.referrer_id)
      .single();

    if (!l1Referrer) {
      return NextResponse.json({ error: 'L1 referrer not found' }, { status: 404 });
    }

    const l1IsLt =
      l1Referrer.tier === 'DAG_LIEUTENANT' || l1Referrer.tier === 'DAG LIEUTENANT';
    const l1Label = l1IsLt ? 'DAG LIEUTENANT' : 'DAG SOLDIER';

    // 1️⃣ Referral upgrade bonus (pts)
    const upgradeBonusPts = l1IsLt
      ? (cfg.lieutenant_refers_upgrade ?? 1000)
      : (cfg.soldier_refers_upgrade ?? 500);

    await supabase.rpc('add_dag_points', {
      p_user_id: l1Referrer.id,
      p_points: upgradeBonusPts,
      p_transaction_type: 'referral_upgrade',
      p_description: `Referral upgrade bonus - your referral upgraded to DAG LIEUTENANT (+${upgradeBonusPts} pts, ${l1Label} rate)`,
      p_reference_id: referral.id,
    });

    // 2️⃣ Spend-based DAG Points ($149 × per-dollar rate)
    const spendRate = l1IsLt
      ? (cfg.spend_pts_per_dollar_lieutenant ?? 50)
      : (cfg.spend_pts_per_dollar_soldier ?? 25);
    const spendPts = Math.round(amountPaidUsd * spendRate);

    await supabase.rpc('add_dag_points', {
      p_user_id: l1Referrer.id,
      p_points: spendPts,
      p_transaction_type: 'spend_based',
      p_description: `Spend-based bonus - referral spent $${amountPaidUsd} on LT upgrade (+${spendPts} pts @ ${spendRate} pts/$)`,
      p_reference_id: referral.id,
    });

    // 3️⃣ USD commission - L1 (15% Soldier / 20% LT)
    const l1CommPct = l1IsLt
      ? (cfg.lieutenant_l1_commission_pct ?? 20)
      : (cfg.soldier_l1_commission_pct ?? 15);
    const l1CommUsd = parseFloat(((amountPaidUsd * l1CommPct) / 100).toFixed(2));

    await supabase.from('sales_commissions').insert({
      user_id: l1Referrer.id,
      buyer_id: upgradedUserId,
      product_type: 'DAG_LIEUTENANT_UPGRADE',
      product_name: 'DAG Lieutenant Upgrade ($149)',
      sale_amount: amountPaidUsd,
      commission_percentage: l1CommPct,
      commission_amount: l1CommUsd,
      commission_level: 1,
      seller_tier: l1Referrer.tier,
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
    });

    // ── L2 Referrer (referrer's referrer) ──────────────────────────────────
    const l2CommPct = cfg.l2_commission_pct ?? 3;
    if (l1Referrer.referred_by_user_id) {
      const { data: l2Referrer } = await supabase
        .from('users')
        .select('id, tier, referred_by_user_id')
        .eq('id', l1Referrer.referred_by_user_id)
        .single();

      if (l2Referrer) {
        const l2CommUsd = parseFloat(((amountPaidUsd * l2CommPct) / 100).toFixed(2));
        await supabase.from('sales_commissions').insert({
          user_id: l2Referrer.id,
          buyer_id: upgradedUserId,
          product_type: 'DAG_LIEUTENANT_UPGRADE',
          product_name: 'DAG Lieutenant Upgrade ($149)',
          sale_amount: amountPaidUsd,
          commission_percentage: l2CommPct,
          commission_amount: l2CommUsd,
          commission_level: 2,
          seller_tier: l2Referrer.tier,
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
        });

        // ── L3 Referrer ──────────────────────────────────────────────────
        const l3CommPct = cfg.l3_commission_pct ?? 2;
        if (l2Referrer.referred_by_user_id) {
          const { data: l3Referrer } = await supabase
            .from('users')
            .select('id, tier')
            .eq('id', l2Referrer.referred_by_user_id)
            .single();

          if (l3Referrer) {
            const l3CommUsd = parseFloat(((amountPaidUsd * l3CommPct) / 100).toFixed(2));
            await supabase.from('sales_commissions').insert({
              user_id: l3Referrer.id,
              buyer_id: upgradedUserId,
              product_type: 'DAG_LIEUTENANT_UPGRADE',
              product_name: 'DAG Lieutenant Upgrade ($149)',
              sale_amount: amountPaidUsd,
              commission_percentage: l3CommPct,
              commission_amount: l3CommUsd,
              commission_level: 3,
              seller_tier: l3Referrer.tier,
              payment_status: 'paid',
              paid_at: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Update referral record
    const totalPtsAwarded = upgradeBonusPts + spendPts;
    const existingJoin = referral.points_earned_on_join || 0;
    await supabase
      .from('referrals')
      .update({
        points_earned_on_upgrade: totalPtsAwarded,
        total_points_earned: existingJoin + totalPtsAwarded,
        referred_user_upgraded: true,
        upgrade_date: new Date().toISOString(),
      })
      .eq('id', referral.id);

    return NextResponse.json({
      success: true,
      message: 'All referrer rewards issued for LT upgrade',
      referrerTier: l1Referrer.tier,
      upgradeBonusPts,
      spendPts,
      l1CommissionUsd: l1CommUsd,
      totalPtsToReferrer: totalPtsAwarded,
    });

  } catch (error) {
    console.error('Exception in referral upgrade-reward API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
