import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/stripe/webhook
 * Handles Stripe checkout.session.completed events.
 * Upgrades the user to DAG LIEUTENANT and awards referral points.
 * Must be registered in Stripe Dashboard with the signing secret.
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
    // Check user is not already a lieutenant (idempotency guard)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, tier')
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

    // Upgrade to DAG LIEUTENANT
    const { error: upgradeError } = await supabase.rpc('upgrade_to_lieutenant', {
      p_user_id: userId,
      p_payment_id: paymentIntentId || session.id,
    });

    if (upgradeError) {
      console.error('Stripe webhook: upgrade_to_lieutenant failed', upgradeError);
      return NextResponse.json({ error: upgradeError.message }, { status: 500 });
    }

    console.log(`Stripe webhook: upgraded user ${userId} to DAG LIEUTENANT`);

    // Award referral upgrade points to upline (fire-and-forget)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dagarmy.network';
      await fetch(`${baseUrl}/api/referral/upgrade-reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upgradedUserId: userId }),
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
