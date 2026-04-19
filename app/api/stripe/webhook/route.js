import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/smtp-client';
import { lieutenantUpgradeEmailTemplate } from '@/lib/email-templates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/stripe/webhook
 * Handles Stripe checkout.session.completed events for DAG LIEUTENANT upgrades.
 *
 * On successful payment:
 *  1. Upgrades user tier to DAG_LIEUTENANT directly (no points for the upgrader)
 *  2. Sends confirmation email
 *  3. Fires /api/referral/upgrade-reward which handles the REFERRER's:
 *     a. Referral upgrade bonus points (500 or 1000 based on referrer tier)
 *     b. Spend-based DAG Points ($149 × 25 or 50 based on referrer tier)
 *     c. USD sales commissions for L1/L2/L3 upline
 */
export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;

  // Only handle our lieutenant upgrade product
  if (session.metadata?.product !== 'dag_lieutenant_upgrade') {
    return NextResponse.json({ received: true });
  }

  const userId = session.metadata?.userId;
  const paymentIntentId = session.payment_intent;

  if (!userId) {
    console.error('Stripe webhook: missing userId in metadata');
    return NextResponse.json({ error: 'Missing userId in metadata' }, { status: 400 });
  }

  try {
    // Idempotency check - skip if already a lieutenant
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, tier, email, full_name, username')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('Stripe webhook: user not found', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.tier === 'DAG_LIEUTENANT' || user.tier === 'DAG LIEUTENANT') {
      console.log('Stripe webhook: user already lieutenant, skipping', userId);
      return NextResponse.json({ received: true, skipped: 'already_lieutenant' });
    }

    // ── Step 1: Upgrade tier directly (NO points for upgrader per new rules) ──
    const { error: upgradeError } = await supabase
      .from('users')
      .update({
        tier: 'DAG_LIEUTENANT',
        upgraded_at: new Date().toISOString(),
        upgrade_payment_id: paymentIntentId || session.id,
      })
      .eq('id', userId);

    if (upgradeError) {
      console.error('Stripe webhook: tier upgrade failed', upgradeError);
      return NextResponse.json({ error: upgradeError.message }, { status: 500 });
    }

    console.log(`Stripe webhook: upgraded user ${userId} to DAG LIEUTENANT (tier only, no self-points)`);

    // ── Step 2: Send confirmation email (fire-and-forget) ─────────────────
    if (user?.email) {
      const displayName = user.full_name || user.username || 'Soldier';
      sendEmail('support@dagchain.network', {
        to: user.email,
        subject: 'Congratulations! You are now a DAG Lieutenant',
        html: lieutenantUpgradeEmailTemplate({ userName: displayName }),
      }).catch(err => console.error('Stripe webhook: lieutenant email failed (non-blocking):', err));
    }

    // ── Step 3: Fire referral rewards for the upline (fire-and-forget) ────
    // This awards:
    //   • Referral upgrade bonus pts (500 or 1000 based on referrer tier)
    //   • Spend-based pts ($149 × 25 or 50 based on referrer tier)
    //   • USD commission for L1/L2/L3 (15%/3%/2% or 20%/3%/2%)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dagarmy.network';
      await fetch(`${baseUrl}/api/referral/upgrade-reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upgradedUserId: userId,
          amountPaidUsd: 149,
        }),
      });
    } catch (refErr) {
      console.error('Stripe webhook: referral upgrade-reward failed (non-blocking):', refErr);
    }

    return NextResponse.json({ received: true, upgraded: true, userId });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
