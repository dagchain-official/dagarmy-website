import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/referral/validate
 * Validate a referral code
 */
// GET /api/referral/validate?code=XXX — used by frontend referral validation
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Referral code is required' }, { status: 400 });
    }

    // Look up in users.referral_code — primary source of truth (196 records vs 11 in referral_codes table)
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('referral_code', code.toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false, error: 'Invalid referral code' });
    }

    return NextResponse.json({ valid: true, referrerId: data.id, referrerName: data.full_name });

  } catch (error) {
    console.error('Exception in validate API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// POST /api/referral/validate — legacy support
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Referral code is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('referral_code', code.toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false, error: 'Invalid referral code' });
    }

    return NextResponse.json({ valid: true, referrerId: data.id, referrerName: data.full_name });

  } catch (error) {
    console.error('Exception in validate API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
