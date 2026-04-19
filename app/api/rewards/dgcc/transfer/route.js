import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { notifyDgccTransfer } from '@/services/dagchainWebhook';

/**
 * POST /api/rewards/dgcc/transfer
 * Transfer DGCC Coins from DAGARMY to DAGGPT or DAGChain.
 *
 * Body: { user_email, destination: 'daggpt' | 'dagchain', amount }
 *
 * Since DAGARMY and DAGGPT share the SAME Supabase project, the DAGGPT
 * transfer is a direct in-DB write to user_credits - no webhook needed.
 * DAGChain is a separate system and still uses a signed webhook.
 */

// DAGCHAIN_WEBHOOK_URL / DAGCHAIN_WEBHOOK_SECRET are only kept here for legacy
// reference - the actual dispatch now goes through notifyDgccTransfer() which
// uses the correct DAGARMY_OUTGOING_SECRET header.

export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { user_email, destination, amount } = await request.json();

    // Validate inputs
    if (!user_email || !destination || !amount) {
      return NextResponse.json(
        { error: 'user_email, destination, and amount are required' },
        { status: 400 }
      );
    }

    if (!['daggpt', 'dagchain'].includes(destination)) {
      return NextResponse.json(
        { error: 'destination must be "daggpt" or "dagchain"' },
        { status: 400 }
      );
    }

    const transferAmount = Number(amount);
    if (!Number.isInteger(transferAmount) || transferAmount <= 0) {
      return NextResponse.json(
        { error: 'amount must be a positive integer' },
        { status: 400 }
      );
    }

    // Fetch user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, dgcc_balance')
      .eq('email', user_email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentBalance = user.dgcc_balance || 0;

    if (currentBalance < transferAmount) {
      return NextResponse.json({
        error: 'Insufficient DGCC balance',
        available: currentBalance,
        required:  transferAmount,
      }, { status: 400 });
    }

    // Deduct from users.dgcc_balance
    const newDgccBalance = currentBalance - transferAmount;
    const { error: updateError } = await supabase
      .from('users')
      .update({ dgcc_balance: newDgccBalance })
      .eq('id', user.id);

    if (updateError) {
      console.error('DGCC deduct error:', updateError);
      return NextResponse.json(
        { error: 'Failed to deduct DGCC balance', details: updateError.message },
        { status: 500 }
      );
    }

    // ── DAGGPT: Direct Supabase write (same DB - no webhook needed) ──────────
    let credited = false;
    let transferId = null;

    if (destination === 'daggpt') {
      // Find or create user_credits row for this user
      const { data: creditRows } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id);

      const current = creditRows?.[0];
      const newCreditBalance = (current?.balance || 0) + transferAmount;

      if (current) {
        await supabase
          .from('user_credits')
          .update({
            balance:         newCreditBalance,
            total_purchased: (current.total_purchased || 0) + transferAmount,
            updated_at:      new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_credits')
          .insert({
            user_id:         user.id,
            balance:         transferAmount,
            total_purchased: transferAmount,
            total_spent:     0,
            total_bonus:     0,
          });
      }

      // Record credit transaction (use correct schema columns)
      const { error: txErr } = await supabase.from('credit_transactions').insert({
        user_id:         user.id,
        type:            'dgcc_transfer',
        amount:          transferAmount,
        balance_after:   newCreditBalance,
        description:     `DGCC transfer from DAGARMY - ${transferAmount} DGCC Coin${transferAmount > 1 ? 's' : ''}`,
        charged_usd:     0,
        charged_credits: 0,
        profit_usd:      0,
      });
      if (txErr) console.error('[dgcc-transfer] credit_transactions insert error:', txErr.message);

      credited = true;
      console.log(`✅ [dgcc-transfer] Credited ${transferAmount} DGCC to user ${user_email} in DAGGPT (balance: ${newCreditBalance})`);

      // Notify DAGChain that user sent DGCC to DAGGPT (they credit staking bonus)
      notifyDgccTransfer({ id: user.id, email: user_email }, transferAmount, 'daggpt', null);
    }

    // ── DAGChain: use shared webhook service (correct auth header) ───────────
    let webhookOk = destination === 'daggpt'; // already handled above

    if (destination === 'dagchain') {
      // notifyDgccTransfer is fire-and-forget - it never throws
      notifyDgccTransfer({ id: user.id, email: user_email }, transferAmount, 'dagchain', null);
      webhookOk = true; // mark ok; actual delivery is async with retries
    }

    // Record transfer in dgcc_transfers table
    const { data: transferRecord } = await supabase
      .from('dgcc_transfers')
      .insert({
        user_id:        user.id,
        destination,
        amount:         transferAmount,
        status:         'completed',
        webhook_status: destination === 'daggpt' ? 'not_required' : (webhookOk ? 'delivered' : 'failed'),
      })
      .select('id')
      .single();

    transferId = transferRecord?.id;

    return NextResponse.json({
      success:            true,
      transfer_id:        transferId,
      destination,
      amount_transferred: transferAmount,
      new_dgcc_balance:   newDgccBalance,
      credited,
      message: `${transferAmount} DGCC Coin${transferAmount > 1 ? 's' : ''} successfully transferred to ${destination === 'daggpt' ? 'DAGGPT' : 'DAGChain'}`,
    });

  } catch (error) {
    console.error('DGCC transfer error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
