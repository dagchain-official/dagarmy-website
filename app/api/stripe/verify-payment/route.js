import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * GET /api/stripe/verify-payment?session_id=...
 * Verifies a Stripe Checkout session was paid.
 * Used by the success page to confirm payment before showing success state.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      paid: session.payment_status === 'paid',
      status: session.payment_status,
      customerEmail: session.customer_email,
    });
  } catch (error) {
    console.error('Stripe verify-payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
