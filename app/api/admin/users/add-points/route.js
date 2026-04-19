import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';

/**
 * POST /api/admin/users/add-points
 * Master Admin grants (or deducts) DAG Points for a specific user.
 * Every operation is recorded in points_transactions with type 'admin_grant'
 * and a unique transaction_id - visible in the Points Ledger tab.
 *
 * Body: { userId, amount (integer, non-zero), reason (string) }
 */
export async function POST(request) {
  const guard = await requirePermission(request, 'rewards.write');
  if (guard) return guard;
  try {
    const { userId, amount, reason } = await request.json();

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!amount || amount === 0) return NextResponse.json({ error: 'amount must be a non-zero integer' }, { status: 400 });
    if (!reason?.trim()) return NextResponse.json({ error: 'reason is required for audit trail' }, { status: 400 });

    const supabase = supabaseAdmin;

    // Verify user exists
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, full_name, email, dag_points')
      .eq('id', userId)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Call add_dag_points DB function - auto-generates transaction_id, updates user totals
    const description = `Admin grant: ${reason.trim()} (user: ${user.full_name || user.email})`;
    const { data: txnId, error: fnErr } = await supabase.rpc('add_dag_points', {
      p_user_id:          userId,
      p_points:           amount,
      p_transaction_type: 'admin_grant',
      p_description:      description,
      p_reference_id:     null,
    });

    if (fnErr) throw fnErr;

    return NextResponse.json({
      success:        true,
      transaction_id: txnId,
      user_id:        userId,
      amount,
      new_balance:    (user.dag_points || 0) + amount,
    });

  } catch (error) {
    console.error('Admin add-points error:', error);
    return NextResponse.json(
      { error: 'Failed to apply points', details: error.message },
      { status: 500 }
    );
  }
}
