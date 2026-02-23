import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/user/payment-info?userId=<uuid>
 * Returns the user's saved payment info (bank + BEP20).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('bep20_address, bank_account_name, bank_account_number, bank_name, bank_branch, bank_swift_iban, preferred_payout')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, paymentInfo: user });
  } catch (error) {
    console.error('Exception in GET /api/user/payment-info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/user/payment-info
 * Save or update the user's payment info.
 * Body: { userId, preferred_payout, bep20_address?, bank_account_name?, bank_account_number?, bank_name?, bank_branch?, bank_swift_iban? }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      preferred_payout,
      bep20_address,
      bank_account_name,
      bank_account_number,
      bank_name,
      bank_branch,
      bank_swift_iban,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!preferred_payout || !['bank', 'crypto'].includes(preferred_payout)) {
      return NextResponse.json({ error: 'preferred_payout must be "bank" or "crypto"' }, { status: 400 });
    }

    // Validate crypto path
    if (preferred_payout === 'crypto') {
      if (!bep20_address || bep20_address.trim().length < 10) {
        return NextResponse.json({ error: 'A valid BEP20 wallet address is required for crypto payout' }, { status: 400 });
      }
    }

    // Validate bank path
    if (preferred_payout === 'bank') {
      if (!bank_account_name || !bank_account_number || !bank_name) {
        return NextResponse.json({ error: 'Account holder name, account number, and bank name are required for bank payout' }, { status: 400 });
      }
    }

    const updateData = {
      preferred_payout,
      updated_at: new Date().toISOString(),
    };

    if (bep20_address !== undefined) updateData.bep20_address = bep20_address?.trim() || null;
    if (bank_account_name !== undefined) updateData.bank_account_name = bank_account_name?.trim() || null;
    if (bank_account_number !== undefined) updateData.bank_account_number = bank_account_number?.trim() || null;
    if (bank_name !== undefined) updateData.bank_name = bank_name?.trim() || null;
    if (bank_branch !== undefined) updateData.bank_branch = bank_branch?.trim() || null;
    if (bank_swift_iban !== undefined) updateData.bank_swift_iban = bank_swift_iban?.trim() || null;

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('bep20_address, bank_account_name, bank_account_number, bank_name, bank_branch, bank_swift_iban, preferred_payout')
      .single();

    if (error) {
      console.error('Error updating payment info:', error);
      return NextResponse.json({ error: 'Failed to save payment info', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, paymentInfo: data });
  } catch (error) {
    console.error('Exception in POST /api/user/payment-info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
