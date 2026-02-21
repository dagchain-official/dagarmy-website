import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server configuration error', leaderboard: [] }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('filter') || 'all-time';
    const currentUserId = searchParams.get('userId') || '';
    const type = searchParams.get('type') || 'points'; // points | referral | sales | certifications
    const sortDir = searchParams.get('sort') || 'desc'; // asc | desc

    // ── Date range helper ──────────────────────────────────────────────────────
    const now = new Date();
    let dateFrom = null;
    let dateTo = null;

    if (timeFilter === 'week-1') {
      const s = new Date(now); s.setDate(now.getDate() - now.getDay()); s.setHours(0,0,0,0);
      dateFrom = s.toISOString();
    } else if (timeFilter === 'week-2') {
      const s = new Date(now); s.setDate(now.getDate() - now.getDay() - 7); s.setHours(0,0,0,0);
      const e = new Date(s); e.setDate(s.getDate() + 7);
      dateFrom = s.toISOString(); dateTo = e.toISOString();
    } else if (timeFilter === 'week-3') {
      const s = new Date(now); s.setDate(now.getDate() - now.getDay() - 14); s.setHours(0,0,0,0);
      const e = new Date(s); e.setDate(s.getDate() + 7);
      dateFrom = s.toISOString(); dateTo = e.toISOString();
    } else if (timeFilter === 'month-1') {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (timeFilter === 'month-2') {
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      dateTo   = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (timeFilter === 'month-3') {
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString();
      dateTo   = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    }

    const ascending = sortDir === 'asc';

    // ── Helper: avatar fallback ────────────────────────────────────────────────
    const avatar = (name, bg = '6366f1') =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=${bg}&color=fff`;

    const fmt = (rows, valueKey, extraFn = () => ({})) => {
      const sorted = [...rows].sort((a, b) =>
        ascending ? a[valueKey] - b[valueKey] : b[valueKey] - a[valueKey]
      );
      return sorted.map((u, i) => ({
        rank: i + 1,
        id: u.id,
        name: u.full_name || 'Anonymous',
        avatar: u.avatar_url || avatar(u.full_name),
        value: u[valueKey] || 0,
        tier: u.tier,
        current_rank: u.current_rank || null,
        isCurrentUser: u.id === currentUserId,
        ...extraFn(u),
      }));
    };

    // ── POINTS leaderboard ─────────────────────────────────────────────────────
    if (type === 'points') {
      if (dateFrom) {
        // Time-scoped: sum from points_transactions
        let txQ = supabase
          .from('points_transactions')
          .select('user_id, points, transaction_type')
          .gte('created_at', dateFrom);
        if (dateTo) txQ = txQ.lt('created_at', dateTo);
        const { data: txs, error: txErr } = await txQ;
        if (txErr) throw txErr;

        const byUser = {};
        (txs || []).forEach(t => {
          if (!byUser[t.user_id]) byUser[t.user_id] = { net: 0, earned: 0, burned: 0, redeemed: 0 };
          byUser[t.user_id].net += t.points;
          if (t.points > 0) byUser[t.user_id].earned += t.points;
          else if (t.transaction_type === 'rank_burn') byUser[t.user_id].burned += Math.abs(t.points);
          else byUser[t.user_id].redeemed += Math.abs(t.points);
        });
        const ids = Object.keys(byUser);
        if (!ids.length) return NextResponse.json({ leaderboard: [], currentUserRank: null });

        const { data: users, error: uErr } = await supabase
          .from('users').select('id,full_name,avatar_url,tier,current_rank,created_at')
          .in('id', ids).eq('role', 'student');
        if (uErr) throw uErr;

        const rows = (users || []).map(u => ({
          ...u,
          dag_points: byUser[u.id]?.net || 0,
          points_earned: byUser[u.id]?.earned || 0,
          points_burned: byUser[u.id]?.burned || 0,
          points_redeemed: byUser[u.id]?.redeemed || 0,
        }));
        const leaderboard = fmt(rows, 'dag_points', u => ({ points_earned: u.points_earned, points_burned: u.points_burned, points_redeemed: u.points_redeemed }));
        return NextResponse.json({ leaderboard: leaderboard.slice(0, 50), currentUserRank: leaderboard.find(u => u.id === currentUserId)?.rank || null });
      }

      // All-time
      const { data: users, error } = await supabase
        .from('users')
        .select('id,full_name,avatar_url,dag_points,total_points_earned,tier,current_rank,created_at')
        .eq('role', 'student').limit(200);
      if (error) throw error;

      // Fetch all negative transactions to split burned vs redeemed
      const { data: txAll } = await supabase
        .from('points_transactions')
        .select('user_id, points, transaction_type')
        .in('user_id', (users || []).map(u => u.id))
        .lt('points', 0);

      const burnMap = {};
      const redeemMap = {};
      (txAll || []).forEach(t => {
        if (t.transaction_type === 'rank_burn') burnMap[t.user_id] = (burnMap[t.user_id] || 0) + Math.abs(t.points);
        else redeemMap[t.user_id] = (redeemMap[t.user_id] || 0) + Math.abs(t.points);
      });

      const leaderboard = fmt(users || [], 'dag_points', u => ({
        points_earned: u.total_points_earned || 0,
        points_burned: burnMap[u.id] || 0,
        points_redeemed: redeemMap[u.id] || 0,
      }));
      return NextResponse.json({ leaderboard: leaderboard.slice(0, 50), currentUserRank: leaderboard.find(u => u.id === currentUserId)?.rank || null });
    }

    // ── REFERRAL leaderboard ───────────────────────────────────────────────────
    if (type === 'referral') {
      if (dateFrom) {
        // Count referrals created in period
        let refQ = supabase
          .from('referrals')
          .select('referrer_id, status, created_at')
          .gte('created_at', dateFrom);
        if (dateTo) refQ = refQ.lt('created_at', dateTo);
        const { data: refs, error: refErr } = await refQ;
        if (refErr) throw refErr;

        const byUser = {};
        (refs || []).forEach(r => {
          if (!byUser[r.referrer_id]) byUser[r.referrer_id] = { total: 0, successful: 0 };
          byUser[r.referrer_id].total++;
          if (r.status === 'completed') byUser[r.referrer_id].successful++;
        });
        const ids = Object.keys(byUser);
        if (!ids.length) return NextResponse.json({ leaderboard: [], currentUserRank: null });

        const { data: users, error: uErr } = await supabase
          .from('users').select('id,full_name,avatar_url,tier,current_rank')
          .in('id', ids).eq('role', 'student');
        if (uErr) throw uErr;

        const rows = (users || []).map(u => ({
          ...u,
          referral_count: byUser[u.id]?.total || 0,
          successful_referrals: byUser[u.id]?.successful || 0,
        }));
        const leaderboard = fmt(rows, 'referral_count', u => ({ successful: u.successful_referrals }));
        return NextResponse.json({ leaderboard: leaderboard.slice(0, 50), currentUserRank: leaderboard.find(u => u.id === currentUserId)?.rank || null });
      }

      // All-time: join referral_stats
      const { data: stats, error: sErr } = await supabase
        .from('referral_stats')
        .select('user_id, total_referrals, successful_referrals, total_points_earned')
        .order('total_referrals', { ascending })
        .limit(200);
      if (sErr) throw sErr;

      const ids = (stats || []).map(s => s.user_id);
      if (!ids.length) return NextResponse.json({ leaderboard: [], currentUserRank: null });

      const { data: users, error: uErr } = await supabase
        .from('users').select('id,full_name,avatar_url,tier,current_rank')
        .in('id', ids).eq('role', 'student');
      if (uErr) throw uErr;

      const userMap = Object.fromEntries((users || []).map(u => [u.id, u]));
      const rows = (stats || [])
        .filter(s => userMap[s.user_id])
        .map(s => ({
          ...userMap[s.user_id],
          referral_count: s.total_referrals || 0,
          successful_referrals: s.successful_referrals || 0,
          referral_points: s.total_points_earned || 0,
        }));
      const leaderboard = fmt(rows, 'referral_count', u => ({
        successful: u.successful_referrals,
        referral_points: u.referral_points,
      }));
      return NextResponse.json({ leaderboard: leaderboard.slice(0, 50), currentUserRank: leaderboard.find(u => u.id === currentUserId)?.rank || null });
    }

    // ── SALES leaderboard ──────────────────────────────────────────────────────
    if (type === 'sales') {
      if (dateFrom) {
        let scQ = supabase
          .from('sales_commissions')
          .select('user_id, commission_amount, payment_status, created_at')
          .eq('payment_status', 'paid')
          .gte('created_at', dateFrom);
        if (dateTo) scQ = scQ.lt('created_at', dateTo);
        const { data: comms, error: scErr } = await scQ;
        if (scErr) throw scErr;

        const byUser = {};
        (comms || []).forEach(c => { byUser[c.user_id] = (byUser[c.user_id] || 0) + Number(c.commission_amount); });
        const ids = Object.keys(byUser);
        if (!ids.length) return NextResponse.json({ leaderboard: [], currentUserRank: null });

        const { data: users, error: uErr } = await supabase
          .from('users').select('id,full_name,avatar_url,tier,current_rank')
          .in('id', ids).eq('role', 'student');
        if (uErr) throw uErr;

        const rows = (users || []).map(u => ({ ...u, total_usd_earned: byUser[u.id] || 0 }));
        const leaderboard = fmt(rows, 'total_usd_earned');
        return NextResponse.json({ leaderboard: leaderboard.slice(0, 50), currentUserRank: leaderboard.find(u => u.id === currentUserId)?.rank || null });
      }

      // All-time
      const { data: users, error } = await supabase
        .from('users')
        .select('id,full_name,avatar_url,total_usd_earned,tier,current_rank')
        .eq('role', 'student').limit(200);
      if (error) throw error;

      const leaderboard = fmt(users || [], 'total_usd_earned');
      return NextResponse.json({ leaderboard: leaderboard.slice(0, 50), currentUserRank: leaderboard.find(u => u.id === currentUserId)?.rank || null });
    }

    // ── CERTIFICATIONS leaderboard ─────────────────────────────────────────────
    if (type === 'certifications') {
      let certQ = supabase
        .from('certifications')
        .select('user_id, id, issued_at, course_id');
      if (dateFrom) certQ = certQ.gte('issued_at', dateFrom);
      if (dateTo)   certQ = certQ.lt('issued_at', dateTo);
      const { data: certs, error: cErr } = await certQ;
      if (cErr) throw cErr;

      const byUser = {};
      (certs || []).forEach(c => { byUser[c.user_id] = (byUser[c.user_id] || 0) + 1; });
      const ids = Object.keys(byUser);
      if (!ids.length) return NextResponse.json({ leaderboard: [], currentUserRank: null });

      const { data: users, error: uErr } = await supabase
        .from('users').select('id,full_name,avatar_url,tier,current_rank')
        .in('id', ids).eq('role', 'student');
      if (uErr) throw uErr;

      const rows = (users || []).map(u => ({ ...u, cert_count: byUser[u.id] || 0 }));
      const leaderboard = fmt(rows, 'cert_count');
      return NextResponse.json({ leaderboard: leaderboard.slice(0, 50), currentUserRank: leaderboard.find(u => u.id === currentUserId)?.rank || null });
    }

    return NextResponse.json({ error: 'Invalid type', leaderboard: [] }, { status: 400 });

  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data', details: error.message, leaderboard: [] },
      { status: 500 }
    );
  }
}
