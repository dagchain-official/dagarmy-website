import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { searchParams } = new URL(request.url);
    // month param: 'YYYY-MM', defaults to current month
    const monthParam = searchParams.get('month') || null;

    const now = new Date();
    const targetYear  = monthParam ? parseInt(monthParam.split('-')[0]) : now.getFullYear();
    const targetMonth = monthParam ? parseInt(monthParam.split('-')[1]) - 1 : now.getMonth();

    const dateFrom = new Date(targetYear, targetMonth, 1).toISOString();
    const dateTo   = new Date(targetYear, targetMonth + 1, 1).toISOString();

    const avatar = (name) =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=6366f1&color=fff`;

    // ── Helper: fetch user info for a list of ids ──────────────────────────────
    const fetchUsers = async (ids) => {
      if (!ids.length) return {};
      const { data } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, tier, current_rank')
        .in('id', ids)
        .eq('role', 'student');
      return Object.fromEntries((data || []).map(u => [u.id, u]));
    };

    // ── POINTS champion ────────────────────────────────────────────────────────
    const { data: pointsTxs } = await supabase
      .from('points_transactions')
      .select('user_id, points')
      .gte('created_at', dateFrom)
      .lt('created_at', dateTo)
      .gt('points', 0);

    const pointsByUser = {};
    (pointsTxs || []).forEach(t => {
      pointsByUser[t.user_id] = (pointsByUser[t.user_id] || 0) + t.points;
    });
    const pointsTopId = Object.entries(pointsByUser).sort((a, b) => b[1] - a[1])[0];

    // ── SALES champion ─────────────────────────────────────────────────────────
    const { data: salesTxs } = await supabase
      .from('sales_commissions')
      .select('user_id, commission_amount')
      .eq('payment_status', 'paid')
      .gte('created_at', dateFrom)
      .lt('created_at', dateTo);

    const salesByUser = {};
    (salesTxs || []).forEach(c => {
      salesByUser[c.user_id] = (salesByUser[c.user_id] || 0) + Number(c.commission_amount);
    });
    const salesTopId = Object.entries(salesByUser).sort((a, b) => b[1] - a[1])[0];

    // ── REFERRALS champion ─────────────────────────────────────────────────────
    const { data: refTxs } = await supabase
      .from('referrals')
      .select('referrer_id')
      .gte('created_at', dateFrom)
      .lt('created_at', dateTo);

    const refsByUser = {};
    (refTxs || []).forEach(r => {
      refsByUser[r.referrer_id] = (refsByUser[r.referrer_id] || 0) + 1;
    });
    const refsTopId = Object.entries(refsByUser).sort((a, b) => b[1] - a[1])[0];

    // ── Fetch user profiles for all 3 winners ─────────────────────────────────
    const winnerIds = [
      pointsTopId?.[0],
      salesTopId?.[0],
      refsTopId?.[0],
    ].filter(Boolean);

    const userMap = await fetchUsers([...new Set(winnerIds)]);

    const buildChampion = (entry, category) => {
      if (!entry) return null;
      const [uid, value] = entry;
      const u = userMap[uid];
      if (!u) return null;
      return {
        id: uid,
        name: u.full_name || 'Anonymous',
        avatar: u.avatar_url || avatar(u.full_name),
        tier: u.tier || 'DAG_SOLDIER',
        current_rank: u.current_rank || null,
        value,
        category,
      };
    };

    const champions = {
      points:    buildChampion(pointsTopId,  'points'),
      sales:     buildChampion(salesTopId,   'sales'),
      referrals: buildChampion(refsTopId,    'referrals'),
    };

    const monthLabel = new Date(targetYear, targetMonth, 1)
      .toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return NextResponse.json({
      month: monthParam || `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`,
      monthLabel,
      champions,
    });

  } catch (error) {
    console.error('Hall of Fame API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hall of fame data', details: error.message },
      { status: 500 }
    );
  }
}
