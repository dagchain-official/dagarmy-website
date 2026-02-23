import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';

/**
 * GET /api/admin/withdrawals
 * List all withdrawal requests with user details.
 * Optional filters: ?status=pending&month=2026-02
 */
export async function GET(request) {
  const guard = await requirePermission(request, 'payments.read');
  if (guard) return guard;
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const month = searchParams.get('month');

    let query = supabaseAdmin
      .from('withdrawal_requests')
      .select(`
        *,
        users (
          id,
          full_name,
          first_name,
          last_name,
          email,
          tier,
          current_rank
        )
      `)
      .order('requested_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (month) {
      query = query.eq('reward_month', month);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching withdrawals:', error);
      return NextResponse.json({ error: 'Failed to fetch withdrawal requests' }, { status: 500 });
    }

    // Compute summary stats
    const stats = {
      total: data.length,
      pending: data.filter(r => r.status === 'pending').length,
      approved: data.filter(r => r.status === 'approved').length,
      processing: data.filter(r => r.status === 'processing').length,
      paid: data.filter(r => r.status === 'paid').length,
      rejected: data.filter(r => r.status === 'rejected').length,
      totalUsd: data.filter(r => r.status !== 'rejected').reduce((s, r) => s + parseFloat(r.amount_usd || 0), 0),
    };

    return NextResponse.json({ success: true, requests: data, stats });
  } catch (error) {
    console.error('Exception in GET /api/admin/withdrawals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
