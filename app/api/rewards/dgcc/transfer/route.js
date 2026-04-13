import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/rewards/dgcc/transfer
 * Transfer DGCC Coins from DAGARMY to DAGGPT or DAGChain.
 *
 * Body: { user_email, destination: 'daggpt' | 'dagchain', amount }
 *
 * Flow:
 *  1. Validate user has sufficient dgcc_balance
 *  2. Deduct from users.dgcc_balance
 *  3. Record in dgcc_transfers
 *  4. Fire webhook to destination platform
 *  5. Return new balance + transfer_id
 */

const DAGGPT_API_URL   = process.env.DAGGPT_API_URL || 'https://api.daggpt.network';
const DAGCHAIN_WEBHOOK = process.env.DAGCHAIN_WEBHOOK_URL || 'https://api.dagchain.network/api/v1/dag-army/webhook';
const SHARED_SECRET    = process.env.SHARED_SSO_SECRET || '';
const DAGCHAIN_SECRET  = process.env.DAGCHAIN_WEBHOOK_SECRET || '';

function signPayload(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

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

    // Deduct from dgcc_balance
    const newBalance = currentBalance - transferAmount;
    const { error: updateError } = await supabase
      .from('users')
      .update({ dgcc_balance: newBalance })
      .eq('id', user.id);

    if (updateError) {
      console.error('DGCC deduct error:', updateError);
      return NextResponse.json(
        { error: 'Failed to deduct DGCC balance', details: updateError.message },
        { status: 500 }
      );
    }

    // Build webhook payload
    const timestamp = new Date().toISOString();
    const webhookPayload = {
      event:   'dgcc_transfer',
      data: {
        email:       user_email,
        full_name:   user.full_name || '',
        amount:      transferAmount,
        destination,
        timestamp,
      },
    };

    // Record transfer in DB (initially webhook_status = 'pending')
    const { data: transferRecord } = await supabase
      .from('dgcc_transfers')
      .insert({
        user_id:         user.id,
        destination,
        amount:          transferAmount,
        status:          'completed',
        webhook_status:  'pending',
        webhook_payload: webhookPayload,
      })
      .select('id')
      .single();

    const transferId = transferRecord?.id;

    // Fire webhook to destination
    let webhookOk = false;
    try {
      if (destination === 'daggpt') {
        const sig = signPayload(webhookPayload, SHARED_SECRET);
        const resp = await fetch(`${DAGGPT_API_URL}/api/webhooks/dagarmy`, {
          method:  'POST',
          headers: {
            'Content-Type':        'application/json',
            'X-DAGARMY-Signature': sig,
            'X-DAGARMY-Timestamp': timestamp,
          },
          body: JSON.stringify(webhookPayload),
        });
        webhookOk = resp.ok;
      } else {
        // DAGChain
        const sig = signPayload(webhookPayload, DAGCHAIN_SECRET);
        const resp = await fetch(DAGCHAIN_WEBHOOK, {
          method:  'POST',
          headers: {
            'Content-Type':          'application/json',
            'X-DAGArmy-Secret':      DAGCHAIN_SECRET,
            'X-DAGArmy-Signature':   sig,
            'X-DAGArmy-Timestamp':   timestamp,
          },
          body: JSON.stringify(webhookPayload),
        });
        webhookOk = resp.ok;
      }
    } catch (webhookErr) {
      console.error(`[dgcc-transfer] Webhook to ${destination} failed:`, webhookErr.message);
    }

    // Update webhook delivery status
    if (transferId) {
      await supabase
        .from('dgcc_transfers')
        .update({ webhook_status: webhookOk ? 'delivered' : 'failed' })
        .eq('id', transferId);
    }

    return NextResponse.json({
      success:          true,
      transfer_id:      transferId,
      destination,
      amount_transferred: transferAmount,
      new_dgcc_balance: newBalance,
      webhook_delivered: webhookOk,
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
