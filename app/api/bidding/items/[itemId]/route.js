import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/bidding/items/[itemId] - item detail + ranked bidder list
export async function GET(request, { params }) {
  try {
    const { itemId } = params;

    // Fetch item
    const { data: item, error: itemErr } = await supabaseAdmin
      .from('bid_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (itemErr || !item) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }

    // Fetch ranked bidders with user info
    const { data: bids, error: bidsErr } = await supabaseAdmin
      .from('bids')
      .select(`
        id, bid_amount, rank, status, placed_at, updated_at,
        user:users ( id, full_name, email, avatar_url )
      `)
      .eq('item_id', itemId)
      .order('bid_amount', { ascending: false });

    if (bidsErr) throw bidsErr;

    // Fetch recent activity for ticker (last 20)
    const { data: activity } = await supabaseAdmin
      .from('bid_activity_log')
      .select(`
        id, amount_added, total_bid, action, created_at,
        user:users ( id, full_name, avatar_url )
      `)
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      success: true,
      item,
      bids: bids || [],
      activity: (activity || []).reverse(), // oldest first for ticker
    });
  } catch (err) {
    console.error('[bidding/items/[itemId] GET]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
