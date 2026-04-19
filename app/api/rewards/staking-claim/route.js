import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { notifyLieutenantUpgrade, notifyDgccTransfer } from '@/services/dagchainWebhook';

/**
 * POST /api/rewards/staking-claim
 *
 * Records the user's staking duration choice and fires the enriched DAGChain webhook.
 * Idempotent - if already claimed, returns 200 with alreadyClaimed: true.
 *
 * Body (lt_upgrade):
 *   { type: 'lt_upgrade', userId, stakingDuration: 1|2|3, stakingApy: 12|18|24, paymentId? }
 *
 * Body (dgcc_transfer):
 *   { type: 'dgcc_transfer', userId, transferId, stakingDuration: 1|2|3, stakingApy: 12|18|24, dgccAmount }
 */

const APY_MAP = { 1: 12, 2: 18, 3: 24 };

export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { type, userId, stakingDuration, stakingApy, paymentId, transferId, dgccAmount } = body;

    // Validate
    if (!type || !userId || !stakingDuration || !stakingApy) {
      return NextResponse.json({ error: 'type, userId, stakingDuration, stakingApy are required' }, { status: 400 });
    }

    if (!['lt_upgrade', 'dgcc_transfer'].includes(type)) {
      return NextResponse.json({ error: 'type must be lt_upgrade or dgcc_transfer' }, { status: 400 });
    }

    if (![1, 2, 3].includes(Number(stakingDuration))) {
      return NextResponse.json({ error: 'stakingDuration must be 1, 2, or 3' }, { status: 400 });
    }

    if (APY_MAP[Number(stakingDuration)] !== Number(stakingApy)) {
      return NextResponse.json({ error: `stakingApy ${stakingApy}% does not match duration ${stakingDuration}Y` }, { status: 400 });
    }

    const dur = Number(stakingDuration);
    const apy = Number(stakingApy);
    const claimedAt = new Date().toISOString();

    // Fetch user for webhook
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, staking_perk_claimed_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ── lt_upgrade ────────────────────────────────────────────────────────────
    if (type === 'lt_upgrade') {
      // Idempotency guard
      if (user.staking_perk_claimed_at) {
        return NextResponse.json({ success: true, alreadyClaimed: true });
      }

      // Mark claimed
      const { error: updateErr } = await supabase
        .from('users')
        .update({ staking_perk_claimed_at: claimedAt })
        .eq('id', userId);

      if (updateErr) {
        console.error('[staking-claim] lt_upgrade update error:', updateErr.message);
        return NextResponse.json({ error: 'Failed to record staking claim' }, { status: 500 });
      }

      // Fire webhook with staking data (fire-and-forget)
      notifyLieutenantUpgrade(
        { id: user.id, email: user.email },
        paymentId || null,
        { duration: dur, apy, dgccStaked: 149, claimedAt }
      );

      console.log(`[staking-claim] lt_upgrade claimed - user=${userId} dur=${dur}Y apy=${apy}%`);
      return NextResponse.json({ success: true, type: 'lt_upgrade', stakingDuration: dur, stakingApy: apy, dgccStaked: 149 });
    }

    // ── dgcc_transfer (daggpt destination only) ───────────────────────────────
    if (type === 'dgcc_transfer') {
      if (!transferId || !dgccAmount) {
        return NextResponse.json({ error: 'transferId and dgccAmount are required for dgcc_transfer' }, { status: 400 });
      }

      const amt = Number(dgccAmount);

      // Fetch transfer record
      const { data: transfer, error: txError } = await supabase
        .from('dgcc_transfers')
        .select('id, user_id, destination, amount, staking_claimed_at')
        .eq('id', transferId)
        .single();

      if (txError || !transfer) {
        return NextResponse.json({ error: 'Transfer record not found' }, { status: 404 });
      }

      // Must be a daggpt transfer
      if (transfer.destination !== 'daggpt') {
        return NextResponse.json({ error: 'Staking perk only applies to daggpt transfers' }, { status: 400 });
      }

      // Idempotency guard
      if (transfer.staking_claimed_at) {
        return NextResponse.json({ success: true, alreadyClaimed: true });
      }

      // Record staking choice on transfer
      const { error: txUpdateErr } = await supabase
        .from('dgcc_transfers')
        .update({
          staking_duration:   dur,
          staking_apy:        apy,
          staking_claimed_at: claimedAt,
        })
        .eq('id', transferId);

      if (txUpdateErr) {
        console.error('[staking-claim] dgcc_transfer update error:', txUpdateErr.message);
        return NextResponse.json({ error: 'Failed to record staking claim' }, { status: 500 });
      }

      // Fire webhook with staking data (fire-and-forget)
      notifyDgccTransfer(
        { id: user.id, email: user.email },
        amt,
        'daggpt',
        transferId,
        { duration: dur, apy, claimedAt }
      );

      console.log(`[staking-claim] dgcc_transfer claimed - user=${userId} amount=${amt} dur=${dur}Y apy=${apy}%`);
      return NextResponse.json({ success: true, type: 'dgcc_transfer', stakingDuration: dur, stakingApy: apy, dgccStaked: amt });
    }

  } catch (error) {
    console.error('[staking-claim] Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
