import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/referral/validate
 * Validate a referral code
 */
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    // Query referral_codes table
    const { data, error } = await supabase
      .from('referral_codes')
      .select('user_id, is_active')
      .eq('referral_code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          valid: false,
          error: 'Invalid referral code'
        });
      }
      return NextResponse.json(
        { error: 'Failed to validate code', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      valid: true,
      referrerId: data.user_id
    });

  } catch (error) {
    console.error('Exception in validate API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
