import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';

/**
 * POST /api/admin/users/add-usd
 * Master Admin manually credits USD commission to a specific user.
 * Inserts a row into sales_commissions with payment_status='paid',
 * which fires the existing trigger_update_user_usd_earned trigger
 * and updates users.usd_earned in real-time.
 *
 * Body: { userId, amount (positive decimal), reason (string) }
 */
export async function POST(request) {
  const guard = await requirePermission(request, 'rewards.write');
  if (guard) return guard;
  try {
    const { userId, amount, reason } = await request.json();

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
    }
    if (!reason?.trim()) {
      return NextResponse.json({ error: 'reason is required for audit trail' }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // Verify user exists
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, full_name, email')
      .eq('id', userId)
      .single();

    if (userErr || !user) {
      console.error('add-usd user lookup error:', userErr);
      return NextResponse.json({ error: 'User not found', details: userErr?.message }, { status: 404 });
    }

    // Insert into sales_commissions as a paid admin-grant entry.
    // The existing trigger_update_user_usd_earned fires on INSERT
    // and adds commission_amount to users.usd_earned automatically.
    const { data: commission, error: insertErr } = await supabase
      .from('sales_commissions')
      .insert({
        user_id:               userId,
        sale_id:               `admin_grant_${Date.now()}`,
        product_type:          'ADMIN_GRANT',
        product_name:          reason.trim(),
        sale_amount:           parsed,
        commission_percentage: 100,
        commission_amount:     parsed,
        commission_level:      1,
        seller_tier:           user.tier || 'DAG SOLDIER',
        payment_status:        'paid',
        paid_at:               new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertErr) throw insertErr;

    return NextResponse.json({
      success:         true,
      commission_id:   commission.id,
      user_id:         userId,
      amount:          parsed,
      new_balance_est: parsed,
    });

  } catch (error) {
    console.error('Admin add-usd error:', error);
    return NextResponse.json(
      { error: 'Failed to credit USD', details: error.message },
      { status: 500 }
    );
  }
}
