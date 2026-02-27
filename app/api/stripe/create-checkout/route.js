import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/stripe/create-checkout
 * Creates a Stripe Checkout session for the DAG Lieutenant upgrade.
 * Body: { userId, userEmail, test?: boolean }
 *   test=true  → $5 "Mini Lieutenant" test payment
 *   test=false → $149 full Lieutenant upgrade
 */
export async function POST(request) {
  try {
    const { userId, userEmail, test = false } = await request.json();

    if (!userId || !userEmail) {
      return NextResponse.json({ error: 'userId and userEmail are required' }, { status: 400 });
    }

    // Check user exists and is not already a lieutenant
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, tier, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.tier === 'DAG_LIEUTENANT' || user.tier === 'DAG LIEUTENANT') {
      return NextResponse.json({ error: 'User is already a DAG LIEUTENANT' }, { status: 400 });
    }

    const baseUrl = request.headers.get('origin') || 'https://dagarmy.network';

    const isTest = test === true;
    const unitAmount = isTest ? 500 : 14900; // $5 or $149 in cents
    const productName = isTest ? 'Mini Lieutenant Upgrade (Test)' : 'DAG Lieutenant Upgrade';
    const productDesc = isTest
      ? 'Test payment — verifies the Stripe checkout and upgrade flow end-to-end.'
      : 'Upgrade from DAG Soldier to DAG Lieutenant — unlock full earning potential, referral bonuses, and exclusive benefits.';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDesc,
              images: [`${baseUrl}/images/logo/logo.png`],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userEmail,
      metadata: {
        userId,
        userEmail,
        product: 'dag_lieutenant_upgrade',
        test: isTest ? 'true' : 'false',
      },
      success_url: `${baseUrl}/success/upgrade?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/student-rewards`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe create-checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
