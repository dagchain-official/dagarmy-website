import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/bidding/items - public list of active + upcoming auctions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active' | 'upcoming' | 'closed' | all

    let query = supabaseAdmin
      .from('bid_items')
      .select(`
        id, title, description, images, status,
        starts_at, ends_at, starting_bid, min_increment, max_winners,
        current_highest_bid, current_highest_bidder_id,
        total_bids_count, total_dag_locked, created_at
      `)
      .order('ends_at', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.in('status', ['active', 'upcoming']);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, items: data });
  } catch (err) {
    console.error('[bidding/items GET]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
