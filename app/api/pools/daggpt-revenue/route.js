import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * POST /api/pools/daggpt-revenue
 * Secured endpoint — DAGGPT backend posts monthly revenue here.
 * Calculates 10% pool contribution and creates a fortune500_distributions record.
 * Idempotent — rejects duplicate submissions for the same month.
 *
 * Headers: Authorization: Bearer <DAGGPT_API_KEY>
 * Body: { report_month: 'YYYY-MM', total_revenue: number }
 */
export async function POST(request) {
  // ── Auth check ─────────────────────────────────────────────
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

    // Validate month format
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

    // Get Fortune 500 pool percentage from config
    const { data: cfg } = await supabase
      .from('rewards_config')
      .select('config_value')
      .eq('config_key', 'fortune500_pool_pct')
      .single();

    const poolPct = parseFloat(cfg?.config_value ?? 10);
    const poolAmount = parseFloat(((total_revenue * poolPct) / 100).toFixed(2));

    // Get active member count
    const { count: memberCount } = await supabase
      .from('fortune500_members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const perMemberAmount = memberCount > 0
      ? parseFloat((poolAmount / memberCount).toFixed(4))
      : 0;

    // Record the revenue report
    await supabase.from('daggpt_revenue_reports').insert({
      report_month,
      total_revenue: parseFloat(total_revenue.toFixed(2)),
      pool_contribution: poolAmount,
      source: 'daggpt_api',
    });

    // Create distribution record (status: pending — admin distributes)
    const { data: dist, error: distErr } = await supabase
      .from('fortune500_distributions')
      .insert({
        period: report_month,
        total_daggpt_revenue: parseFloat(total_revenue.toFixed(2)),
        pool_amount: poolAmount,
        member_count: memberCount || 0,
        per_member_amount: perMemberAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (distErr) {
      console.error('Failed to create fortune500_distributions record:', distErr);
      return NextResponse.json(
        { error: 'Revenue recorded but distribution record failed', details: distErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Fortune 500 pool created for ${report_month}`,
      report_month,
      total_revenue: parseFloat(total_revenue.toFixed(2)),
      pool_amount: poolAmount,
      member_count: memberCount || 0,
      per_member_amount: perMemberAmount,
      distribution_status: 'pending',
      distribution_id: dist.id,
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
