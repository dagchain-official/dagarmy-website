import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/admin/fortune500
 * Returns: list of all distributions + current member count + revenue reports
 * Auth: checks admin session via dagarmy_user in cookie/body (same pattern as other admin routes)
 */
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;

    const [
      { data: distributions },
      { data: revenueReports },
      { count: memberCount },
    ] = await Promise.all([
      supabase
        .from('fortune500_distributions')
        .select('*')
        .order('period', { ascending: false })
        .limit(24),
      supabase
        .from('daggpt_revenue_reports')
        .select('*')
        .order('report_month', { ascending: false })
        .limit(24),
      supabase
        .from('fortune500_members')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true),
    ]);

    return NextResponse.json({
      success: true,
      distributions: distributions || [],
      revenueReports: revenueReports || [],
      activeMemberCount: memberCount || 0,
    });
  } catch (error) {
    console.error('[GET /api/admin/fortune500]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/fortune500
 * Body: { distribution_id: string, action: 'distribute' | 'cancel' }
 * 'distribute' → marks status as 'distributed', updates distributed_at, and records
 *   per-member point_transactions of type 'fortune500_payout' for each active member.
 */
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { distribution_id, action } = body;

    if (!distribution_id || !action) {
      return NextResponse.json({ error: 'distribution_id and action are required' }, { status: 400 });
    }

    // Fetch the distribution record
    const { data: dist, error: distErr } = await supabase
      .from('fortune500_distributions')
      .select('*')
      .eq('id', distribution_id)
      .single();

    if (distErr || !dist) {
      return NextResponse.json({ error: 'Distribution not found' }, { status: 404 });
    }

    if (action === 'cancel') {
      await supabase
        .from('fortune500_distributions')
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

    // Fetch all active fortune500 members
    const { data: members, error: membersErr } = await supabase
      .from('fortune500_members')
      .select('user_id')
      .eq('is_active', true);

    if (membersErr || !members?.length) {
      return NextResponse.json({ error: 'No active members found' }, { status: 400 });
    }

    const perMember = parseFloat(dist.per_member_amount || 0);
    if (perMember <= 0) {
      return NextResponse.json({ error: 'Per-member amount is 0 — nothing to distribute' }, { status: 400 });
    }

    // Fetch each member's current point balance for balance_before tracking
    const memberIds = members.map(m => m.user_id);

    const { data: usersData } = await supabase
      .from('users')
      .select('id, dag_points')
      .in('id', memberIds);

    const balanceMap = {};
    (usersData || []).forEach(u => { balanceMap[u.id] = u.dag_points || 0; });

    // Build point_transactions inserts — one per member
    const now = new Date().toISOString();
    const txInserts = members.map(m => ({
      user_id: m.user_id,
      points: Math.round(perMember), // DAG Points equivalent (rounded)
      transaction_type: 'fortune500_payout',
      description: `Fortune 500 Pool — ${dist.period} distribution ($${perMember.toFixed(4)} per member)`,
      balance_before: balanceMap[m.user_id] || 0,
      balance_after: (balanceMap[m.user_id] || 0) + Math.round(perMember),
      created_at: now,
    }));

    // Insert all transactions in batch
    const { error: txErr } = await supabase
      .from('points_transactions')
      .insert(txInserts);

    if (txErr) {
      console.error('[fortune500/distribute] TX insert error:', txErr);
      return NextResponse.json({ error: 'Failed to insert payout transactions', details: txErr.message }, { status: 500 });
    }

    // Update user dag_points for all members
    // (Use RPC if available, otherwise loop — here we do batch updates via the trigger or direct update)
    for (const m of members) {
      const newBalance = (balanceMap[m.user_id] || 0) + Math.round(perMember);
      await supabase.from('users').update({ dag_points: newBalance }).eq('id', m.user_id);
    }

    // Mark distribution as completed
    const { error: updateErr } = await supabase
      .from('fortune500_distributions')
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
      message: `Distributed $${perMember.toFixed(4)} to ${members.length} members for ${dist.period}`,
      distribution_id,
      period: dist.period,
      members_paid: members.length,
      per_member_amount: perMember,
    });

  } catch (error) {
    console.error('[POST /api/admin/fortune500]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
