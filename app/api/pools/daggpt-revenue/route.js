import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * POST /api/pools/daggpt-revenue
 * Secured endpoint — DAGGPT backend posts monthly revenue here.
 * Creates distribution records for BOTH Fortune 500 AND DAG LT Pool.
 * Idempotent — rejects duplicate submissions for the same month.
 *
 * Headers: Authorization: Bearer <DAGGPT_API_KEY>
 * Body: { report_month: 'YYYY-MM', total_revenue: number }
 */
export async function POST(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const validKey = process.env.DAGGPT_API_KEY;

  if (!validKey || token !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = supabaseAdmin;
    const { report_month, total_revenue } = await request.json();

    if (!report_month || !total_revenue || total_revenue <= 0) {
      return NextResponse.json(
        { error: 'report_month (YYYY-MM) and total_revenue (> 0) are required' },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}$/.test(report_month)) {
      return NextResponse.json(
        { error: 'report_month must be in YYYY-MM format' },
        { status: 400 }
      );
    }

    // Idempotency — check if already reported
    const { data: existing } = await supabase
      .from('daggpt_revenue_reports')
      .select('id')
      .eq('report_month', report_month)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `Revenue for ${report_month} has already been reported`, alreadyReported: true },
        { status: 409 }
      );
    }

    // ── Fetch pool percentages from config ─────────────────────────────────
    const { data: configs } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', ['fortune500_pool_pct', 'dag_lt_pool_pct']);

    const cfgMap = {};
    (configs || []).forEach(c => { cfgMap[c.config_key] = parseFloat(c.config_value); });
    const f500Pct = cfgMap['fortune500_pool_pct'] ?? 10;
    const ltPoolPct = cfgMap['dag_lt_pool_pct'] ?? 10;

    const totalRevenue = parseFloat(total_revenue.toFixed(2));

    // ── Fortune 500 pool ───────────────────────────────────────────────────
    const f500Amount = parseFloat(((totalRevenue * f500Pct) / 100).toFixed(2));
    const { count: f500MemberCount } = await supabase
      .from('fortune500_members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    const f500PerMember = (f500MemberCount || 0) > 0
      ? parseFloat((f500Amount / f500MemberCount).toFixed(4))
      : 0;

    // ── DAG LT Pool ────────────────────────────────────────────────────────
    const ltPoolAmount = parseFloat(((totalRevenue * ltPoolPct) / 100).toFixed(2));
    const { count: ltMemberCount } = await supabase
      .from('dag_lt_pool_members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    const ltPerMember = (ltMemberCount || 0) > 0
      ? parseFloat((ltPoolAmount / ltMemberCount).toFixed(4))
      : 0;

    // ── Record revenue report (total pool_contribution = f500 + lt) ────────
    const totalPoolContribution = parseFloat((f500Amount + ltPoolAmount).toFixed(2));
    await supabase.from('daggpt_revenue_reports').insert({
      report_month,
      total_revenue: totalRevenue,
      pool_contribution: totalPoolContribution,
      source: 'daggpt_api',
    });

    // ── Create Fortune 500 distribution (pending) ──────────────────────────
    const { data: f500Dist, error: f500Err } = await supabase
      .from('fortune500_distributions')
      .insert({
        period: report_month,
        total_daggpt_revenue: totalRevenue,
        pool_amount: f500Amount,
        member_count: f500MemberCount || 0,
        per_member_amount: f500PerMember,
        status: 'pending',
      })
      .select()
      .single();

    if (f500Err) {
      console.error('Failed to create fortune500_distributions record:', f500Err);
      return NextResponse.json(
        { error: 'Revenue recorded but Fortune 500 distribution failed', details: f500Err.message },
        { status: 500 }
      );
    }

    // ── Create DAG LT Pool distribution (pending) ──────────────────────────
    const { data: ltDist, error: ltErr } = await supabase
      .from('dag_lt_pool_distributions')
      .insert({
        period: report_month,
        total_daggpt_revenue: totalRevenue,
        pool_amount: ltPoolAmount,
        member_count: ltMemberCount || 0,
        per_member_amount: ltPerMember,
        status: 'pending',
      })
      .select()
      .single();

    if (ltErr) {
      console.error('Failed to create dag_lt_pool_distributions record:', ltErr);
      return NextResponse.json(
        { error: 'Fortune 500 distribution created but DAG LT Pool distribution failed', details: ltErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Revenue pools created for ${report_month}`,
      report_month,
      total_revenue: totalRevenue,
      fortune500: {
        pool_pct: f500Pct,
        pool_amount: f500Amount,
        member_count: f500MemberCount || 0,
        per_member_amount: f500PerMember,
        distribution_id: f500Dist.id,
        status: 'pending',
      },
      dag_lt_pool: {
        pool_pct: ltPoolPct,
        pool_amount: ltPoolAmount,
        member_count: ltMemberCount || 0,
        per_member_amount: ltPerMember,
        distribution_id: ltDist.id,
        status: 'pending',
      },
    });

  } catch (error) {
    console.error('Error processing DAGGPT revenue report:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pools/daggpt-revenue
 * Admin: list all revenue reports (same auth required)
 */
export async function GET(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const validKey = process.env.DAGGPT_API_KEY;

  if (!validKey || token !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = supabaseAdmin;
    const { data: reports } = await supabase
      .from('daggpt_revenue_reports')
      .select('*')
      .order('report_month', { ascending: false })
      .limit(24);

    return NextResponse.json({ success: true, reports: reports || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
