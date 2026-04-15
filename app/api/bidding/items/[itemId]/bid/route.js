import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// POST /api/bidding/items/[itemId]/bid
// Body: { userId, amount }   — amount = DAG Points to add
// Works for both new bids and top-ups (handled atomically in DB function)
export async function POST(request, { params }) {
  try {
    const { itemId } = params;
    const body = await request.json();
    const { userId, amount } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      return NextResponse.json({ error: 'amount must be a positive integer' }, { status: 400 });
    }

    // Call atomic DB function
    const { data, error } = await supabaseAdmin.rpc('place_or_increase_bid', {
      p_user_id: userId,
      p_item_id: itemId,
      p_amount:  amount,
    });

    if (error) {
      console.error('[bidding/bid POST] rpc error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // data is the JSONB return from the function
    if (!data?.ok) {
      return NextResponse.json(
        { error: data?.error || 'Bid failed', min_required: data?.min_required },
        { status: 400 }
      );
    }

    // Fetch updated user points balance to return to UI
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('dag_points')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      success:     true,
      action:      data.action,   // 'new_bid' | 'top_up'
      new_total:   data.new_total,
      dag_points:  user?.dag_points ?? null,
    });
  } catch (err) {
    console.error('[bidding/bid POST]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
