import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/points-ledger
 * Returns all points_transactions joined with user name + email.
 * Used by the Admin Rewards > Points Ledger tab.
 * Supports optional ?search=TXN-... query param for server-side filtering.
 */
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';

    // Fetch transactions with user info via join
    let query = supabase
      .from('points_transactions')
      .select(`
        id,
        transaction_id,
        points,
        transaction_type,
        description,
        reference_id,
        created_at,
        users!inner (
          id,
          full_name,
          email,
          tier,
          current_rank
        )
      `)
      .order('created_at', { ascending: false })
      .limit(2000);

    // Server-side filter by transaction_id if provided
    if (search && search.startsWith('TXN-')) {
      query = query.ilike('transaction_id', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const transactions = (data || []).map(tx => ({
      id:               tx.id,
      transaction_id:   tx.transaction_id || null,
      points:           tx.points,
      transaction_type: tx.transaction_type,
      description:      tx.description,
      reference_id:     tx.reference_id,
      created_at:       tx.created_at,
      user_id:          tx.users?.id,
      user_name:        tx.users?.full_name || 'Unknown',
      user_email:       tx.users?.email || '',
      user_tier:        tx.users?.tier || 'DAG_SOLDIER',
      user_rank:        tx.users?.current_rank || null,
    }));

    return NextResponse.json({ transactions, total: transactions.length });

  } catch (error) {
    console.error('Points Ledger API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch points ledger', details: error.message },
      { status: 500 }
    );
  }
}
