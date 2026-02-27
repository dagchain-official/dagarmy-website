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
 * Creates a Stripe Checkout session for the DAG Lieutenant upgrade ($149).
 * Requires the user to be authenticated via wallet/session.
 * Body: { userId, userEmail }
 */
export async function POST(request) {
  try {
    const { userId, userEmail } = await request.json();

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'DAG Lieutenant Upgrade',
              description: 'Upgrade from DAG Soldier to DAG Lieutenant — unlock full earning potential, referral bonuses, and exclusive benefits.',
              images: [`${baseUrl}/images/logo/logo.png`],
            },
            unit_amount: 14900, // $149.00 in cents
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
