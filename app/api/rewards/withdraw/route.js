import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/rewards/withdraw?userId=<uuid>
 * Returns all withdrawal requests for a user.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('withdrawal_requests')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch withdrawal requests' }, { status: 500 });
    }

    return NextResponse.json({ success: true, requests: data || [] });
  } catch (error) {
    console.error('Exception in GET /api/rewards/withdraw:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/rewards/withdraw
 * Submit a withdrawal request for a given reward month.
 * Body: { userId, rewardMonth, amountUsd }
 * - rewardMonth format: "2026-02"
 * - amountUsd must be >= 10
 * - One request per user per month (enforced by DB unique constraint)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, rewardMonth, amountUsd } = body;

    if (!userId || !rewardMonth || amountUsd === undefined) {
      return NextResponse.json({ error: 'userId, rewardMonth, and amountUsd are required' }, { status: 400 });
    }

    // Validate month format YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(rewardMonth)) {
      return NextResponse.json({ error: 'rewardMonth must be in YYYY-MM format' }, { status: 400 });
    }

    const amount = parseFloat(amountUsd);
    if (isNaN(amount) || amount < 10) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is $10' }, { status: 400 });
    }

    // Fetch user's payment info
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('preferred_payout, bep20_address, bank_account_name, bank_account_number, bank_name, bank_branch, bank_swift_iban')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate payment info is complete
    if (user.preferred_payout === 'crypto' || !user.preferred_payout) {
      if (!user.bep20_address) {
        return NextResponse.json({
          error: 'No BEP20 wallet address saved. Please add your payment info in Settings.',
          missingPaymentInfo: true
        }, { status: 400 });
      }
    } else {
      if (!user.bank_account_name || !user.bank_account_number || !user.bank_name) {
        return NextResponse.json({
          error: 'Incomplete bank details. Please complete your payment info in Settings.',
          missingPaymentInfo: true
        }, { status: 400 });
      }
    }

    // Check for existing request for this month
    const { data: existing } = await supabaseAdmin
      .from('withdrawal_requests')
      .select('id, status')
      .eq('user_id', userId)
      .eq('reward_month', rewardMonth)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        error: `A withdrawal request for ${rewardMonth} already exists (status: ${existing.status}).`,
        alreadyExists: true
      }, { status: 409 });
    }

    // Build snapshot of payment details at time of request
    const payoutMethod = user.preferred_payout || 'bank';
    const bep20Snapshot = payoutMethod === 'crypto' ? user.bep20_address : null;
    const bankSnapshot = payoutMethod === 'bank' ? {
      account_name: user.bank_account_name,
      account_number: user.bank_account_number,
      bank_name: user.bank_name,
      branch: user.bank_branch || null,
      swift_iban: user.bank_swift_iban || null,
    } : null;

    // Compute expected payout date for bank (10th of following month)
    const [year, month] = rewardMonth.split('-').map(Number);
    const payoutDate = new Date(year, month, 10); // month is 0-indexed, so month = next month
    const payoutDateStr = payoutDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const { data: newRequest, error: insertError } = await supabaseAdmin
      .from('withdrawal_requests')
      .insert({
        user_id: userId,
        reward_month: rewardMonth,
        amount_usd: amount,
        payout_method: payoutMethod,
        bep20_address: bep20Snapshot,
        bank_snapshot: bankSnapshot,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json({ error: `A withdrawal request for ${rewardMonth} already exists.`, alreadyExists: true }, { status: 409 });
      }
      console.error('Error inserting withdrawal request:', insertError);
      return NextResponse.json({ error: 'Failed to submit withdrawal request' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: payoutMethod === 'bank'
        ? `Withdrawal request submitted. Bank transfer will be processed on ${payoutDateStr}.`
        : 'Withdrawal request submitted. USDT will be sent to your BEP20 address within 24 hours of admin approval.',
    });

  } catch (error) {
    console.error('Exception in POST /api/rewards/withdraw:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
