import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/admin/dag-lt-pool
 * Returns distributions + active member count for the DAG LT Pool.
 * Eligible members: LTs who self-upgraded AND had 3 direct referrals also upgrade to LT
 * within a 30-day window from their own upgrade date.
 */
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;

    const [
      { data: distributions },
      { count: memberCount },
    ] = await Promise.all([
      supabase
        .from('dag_lt_pool_distributions')
        .select('*')
        .order('period', { ascending: false })
        .limit(24),
      supabase
        .from('dag_lt_pool_members')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true),
    ]);

    return NextResponse.json({
      success: true,
      distributions: distributions || [],
      activeMemberCount: memberCount || 0,
    });
  } catch (error) {
    console.error('[GET /api/admin/dag-lt-pool]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/dag-lt-pool
 * Body: { distribution_id: string, action: 'distribute' | 'cancel' }
 * 'distribute' → marks status as 'distributed', records point_transactions for each active member.
 */
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { distribution_id, action } = body;

    if (!distribution_id || !action) {
      return NextResponse.json({ error: 'distribution_id and action are required' }, { status: 400 });
    }

    const { data: dist, error: distErr } = await supabase
      .from('dag_lt_pool_distributions')
      .select('*')
      .eq('id', distribution_id)
      .single();

    if (distErr || !dist) {
      return NextResponse.json({ error: 'Distribution not found' }, { status: 404 });
    }

    if (action === 'cancel') {
      await supabase
        .from('dag_lt_pool_distributions')
        .update({ status: 'cancelled' })
        .eq('id', distribution_id);
      return NextResponse.json({ success: true, message: 'Distribution cancelled' });
    }

    if (action !== 'distribute') {
      return NextResponse.json({ error: 'Invalid action. Use distribute or cancel.' }, { status: 400 });
    }

    if (dist.status === 'distributed') {
      return NextResponse.json({ error: 'Distribution already completed', alreadyDone: true }, { status: 409 });
    }

    const { data: members, error: membersErr } = await supabase
      .from('dag_lt_pool_members')
      .select('user_id')
      .eq('is_active', true);

    if (membersErr || !members?.length) {
      return NextResponse.json({ error: 'No active DAG LT Pool members found' }, { status: 400 });
    }

    const perMember = parseFloat(dist.per_member_amount || 0);
    if (perMember <= 0) {
      return NextResponse.json({ error: 'Per-member amount is 0 — nothing to distribute' }, { status: 400 });
    }

    const memberIds = members.map(m => m.user_id);

    const { data: usersData } = await supabase
      .from('users')
      .select('id, dag_points')
      .in('id', memberIds);

    const balanceMap = {};
    (usersData || []).forEach(u => { balanceMap[u.id] = u.dag_points || 0; });

    const now = new Date().toISOString();
    const txInserts = members.map(m => ({
      user_id: m.user_id,
      points: Math.round(perMember),
      transaction_type: 'dag_lt_pool_payout',
      description: `DAG LT Pool — ${dist.period} distribution ($${perMember.toFixed(4)} per member)`,
      balance_before: balanceMap[m.user_id] || 0,
      balance_after: (balanceMap[m.user_id] || 0) + Math.round(perMember),
      created_at: now,
    }));

    const { error: txErr } = await supabase
      .from('points_transactions')
      .insert(txInserts);

    if (txErr) {
      console.error('[dag-lt-pool/distribute] TX insert error:', txErr);
      return NextResponse.json({ error: 'Failed to insert payout transactions', details: txErr.message }, { status: 500 });
    }

    for (const m of members) {
      const newBalance = (balanceMap[m.user_id] || 0) + Math.round(perMember);
      await supabase.from('users').update({ dag_points: newBalance }).eq('id', m.user_id);
    }

    const { error: updateErr } = await supabase
      .from('dag_lt_pool_distributions')
      .update({
        status: 'distributed',
        distributed_at: now,
        member_count: members.length,
        per_member_amount: perMember,
      })
      .eq('id', distribution_id);

    if (updateErr) {
      return NextResponse.json({ error: 'Payouts recorded but status update failed', details: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Distributed $${perMember.toFixed(4)} to ${members.length} DAG LT Pool members for ${dist.period}`,
      distribution_id,
      period: dist.period,
      members_paid: members.length,
      per_member_amount: perMember,
    });

  } catch (error) {
    console.error('[POST /api/admin/dag-lt-pool]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
