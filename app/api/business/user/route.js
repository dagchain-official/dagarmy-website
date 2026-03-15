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
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, tier, current_rank')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Resolve effective L1 commission rate for this user based on their current rank
    const RANK_RATE_KEYS = [
      'soldier_direct_sales_commission',
      'rank_commission_initiator','rank_commission_vanguard','rank_commission_guardian',
      'rank_commission_striker','rank_commission_invoker','rank_commission_commander',
      'rank_commission_champion','rank_commission_conqueror','rank_commission_paragon',
      'rank_commission_mythic',
    ];
    const { data: rateRows } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', RANK_RATE_KEYS);
    const rateMap = {};
    (rateRows || []).forEach(r => { rateMap[r.config_key] = parseFloat(r.config_value || 0); });
    const baseL1Rate = rateMap['soldier_direct_sales_commission'] || 7;
    const rank = user.current_rank?.toUpperCase() || null;
    const rankRateKey = rank ? `rank_commission_${rank.toLowerCase()}` : null;
    const effectiveL1Rate = (rankRateKey && rateMap[rankRateKey] > 0) ? rateMap[rankRateKey] : baseL1Rate;

    // Fetch all commission rows for this user
    const { data: commissions, error: commErr } = await supabase
      .from('sales_commissions')
      .select('id, sale_id, sale_amount, commission_percentage, commission_amount, commission_level, product_name, product_type, payment_status, buyer_id, currency, seller_rank, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200);

    if (commErr) throw commErr;

    const rows = commissions || [];

    // Batch-fetch buyer names for unique buyer_ids
    const buyerIds = [...new Set(rows.map(r => r.buyer_id).filter(Boolean))];
    let buyerMap = {};
    if (buyerIds.length > 0) {
      const { data: buyers } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', buyerIds);
      (buyers || []).forEach(b => { buyerMap[b.id] = { name: b.name, email: b.email }; });
    }

    // Attach buyer info and normalise currency to each row
    const transactions = rows.map(r => ({
      ...r,
      currency:    r.currency || 'USD',
      buyer_name:  r.buyer_id ? (buyerMap[r.buyer_id]?.name  || null) : null,
      buyer_email: r.buyer_id ? (buyerMap[r.buyer_id]?.email || null) : null,
      is_self_sale: !r.buyer_id || r.buyer_id === user.id,
    }));

    // Build summary — split by currency
    const summary = {
      totalUsd:  0,
      totalUsdt: 0,
      pendingUsd: 0,
      pendingUsdt: 0,
      byLevel: {
        1: { usd: 0, usdt: 0, count: 0 },
        2: { usd: 0, usdt: 0, count: 0 },
        3: { usd: 0, usdt: 0, count: 0 },
      },
    };

    transactions.forEach(t => {
      const amt    = parseFloat(t.commission_amount || 0);
      const lvl    = t.commission_level || 1;
      const isUsdt = (t.currency || 'USD').toUpperCase() === 'USDT';
      const isAdminGrant = t.product_type === 'ADMIN_GRANT';
      const isPaid      = t.payment_status === 'paid';
      const isEarned    = t.payment_status === 'pending' || t.payment_status === 'requested';
      // Totals: only paid commissions
      if (isPaid) {
        if (isUsdt) summary.totalUsdt += amt;
        else         summary.totalUsd  += amt;
      }
      // Level breakdown: paid + in-flight (requested) count toward earned amounts, admin grants excluded
      if ((isPaid || isEarned) && !isAdminGrant && summary.byLevel[lvl]) {
        if (isUsdt) summary.byLevel[lvl].usdt += amt;
        else         summary.byLevel[lvl].usd  += amt;
        summary.byLevel[lvl].count += 1;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        summary,
        tier: user.tier || 'DAG SOLDIER',
        currentRank: rank,
        effectiveL1Rate,
        baseL1Rate,
      },
    });
  } catch (error) {
    console.error('Error fetching business data:', error);
    return NextResponse.json({ error: 'Failed to fetch business data', details: error.message }, { status: 500 });
  }
}
