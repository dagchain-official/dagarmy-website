import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';

/**
 * PATCH /api/admin/withdrawals/[id]
 * Update the status of a withdrawal request.
 * Body: { status, adminNote? }
 * Valid transitions: pending -> approved -> processing -> paid | rejected
 */
export async function PATCH(request, context) {
  const guard = await requirePermission(request, 'payments.write');
  if (guard) return guard;
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, adminNote } = body;

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const validStatuses = ['approved', 'processing', 'paid', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch existing request
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('withdrawal_requests')
      .select('id, status, payout_method')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    // Prevent re-processing already paid/rejected requests
    if (existing.status === 'paid' || existing.status === 'rejected') {
      return NextResponse.json(
        { error: `Cannot update a request that is already ${existing.status}` },
        { status: 409 }
      );
    }

    const updateData = {
      status,
      admin_note: adminNote || null,
    };

    if (status === 'approved' || status === 'processing') {
      updateData.processed_at = new Date().toISOString();
    }
    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
      if (!updateData.processed_at) {
        updateData.processed_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabaseAdmin
      .from('withdrawal_requests')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        users (
          id,
          full_name,
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error updating withdrawal request:', error);
      return NextResponse.json({ error: 'Failed to update withdrawal request' }, { status: 500 });
    }

    // Settle or restore commissions based on the new withdrawal status
    if (data?.users?.id && data?.reward_month) {
      const commCurrency = data.currency || 'USD';
      const monthEnd = new Date(data.reward_month + '-01');
      monthEnd.setMonth(monthEnd.getMonth() + 1); // exclusive upper bound

      if (status === 'paid') {
        // Flip all 'requested' commissions for this user+currency+month → 'paid'
        const { error: commErr } = await supabaseAdmin
          .from('sales_commissions')
          .update({ payment_status: 'paid', paid_at: new Date().toISOString() })
          .eq('user_id', data.users.id)
          .eq('currency', commCurrency)
          .eq('payment_status', 'requested')
          .lt('created_at', monthEnd.toISOString());

        if (commErr) {
          console.error('Error settling commissions on withdrawal paid:', commErr.message);
        }
      } else if (status === 'rejected') {
        // Revert 'requested' commissions back to 'pending' (earned) - restores balance
        const { error: commErr } = await supabaseAdmin
          .from('sales_commissions')
          .update({ payment_status: 'pending' })
          .eq('user_id', data.users.id)
          .eq('currency', commCurrency)
          .eq('payment_status', 'requested')
          .lt('created_at', monthEnd.toISOString());

        if (commErr) {
          console.error('Error reverting commissions on withdrawal rejected:', commErr.message);
        }
      }
    }

    return NextResponse.json({ success: true, request: data });
  } catch (error) {
    console.error('Exception in PATCH /api/admin/withdrawals/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/admin/withdrawals/[id]
 * Get a single withdrawal request with full user details.
 */
export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
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
          current_rank,
          bep20_address,
          bank_account_name,
          bank_account_number,
          bank_name,
          bank_branch,
          bank_swift_iban,
          preferred_payout
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: data });
  } catch (error) {
    console.error('Exception in GET /api/admin/withdrawals/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
