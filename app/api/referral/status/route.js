import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/referral/status?userId=xxx
 * Returns the referrer info if this user was referred by someone, otherwise null.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { data: referral, error } = await supabaseAdmin
      .from('referrals')
      .select('referrer_id, referral_code, status')
      .eq('referred_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching referral status:', error);
      return NextResponse.json({ referrer: null });
    }

    if (!referral) {
      return NextResponse.json({ referrer: null });
    }

    // Fetch referrer details
    const { data: referrer } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email')
      .eq('id', referral.referrer_id)
      .single();

    return NextResponse.json({
      referrer: {
        id: referrer?.id || referral.referrer_id,
        name: referrer?.full_name || referrer?.email?.split('@')[0] || 'Unknown',
      },
      referral_code: referral.referral_code,
      status: referral.status,
    });

  } catch (error) {
    console.error('Exception in referral status API:', error);
    return NextResponse.json({ referrer: null });
  }
}
