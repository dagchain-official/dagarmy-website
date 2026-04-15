import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/admin-auth';

// PUT /api/bidding/admin/items/[itemId] — update auction (only before it starts)
export async function PUT(request, { params }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { itemId } = params;
    const body = await request.json();

    // Only allow editing upcoming auctions
    const { data: existing } = await supabaseAdmin
      .from('bid_items').select('status').eq('id', itemId).single();

    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing.status === 'active' || existing.status === 'closed') {
      return NextResponse.json(
        { error: 'Cannot edit an active or closed auction. Cancel it first.' },
        { status: 400 }
      );
    }

    const allowedFields = [
      'title','description','features','images',
      'starts_at','ends_at','starting_bid','min_increment','max_winners','admin_note'
    ];
    const updates = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const { data, error } = await supabaseAdmin
      .from('bid_items').update(updates).eq('id', itemId).select().single();

    if (error) throw error;
    return NextResponse.json({ success: true, item: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/bidding/admin/items/[itemId] — cancel auction & refund all bids
export async function DELETE(request, { params }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { itemId } = params;

    const { data: item } = await supabaseAdmin
      .from('bid_items').select('*').eq('id', itemId).single();

    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (item.status === 'closed') {
      return NextResponse.json({ error: 'Cannot cancel a closed auction' }, { status: 400 });
    }

    // Refund all active bids
    const { data: activeBids } = await supabaseAdmin
      .from('bids')
      .select('id, user_id, bid_amount')
      .eq('item_id', itemId)
      .eq('status', 'active');

    for (const bid of activeBids || []) {
      await supabaseAdmin
        .from('users')
        .update({ dag_points: supabaseAdmin.rpc('dag_points + ' + bid.bid_amount) })
        .eq('id', bid.user_id);

      // Use raw SQL for atomic increment
      await supabaseAdmin.rpc('place_or_increase_bid', {
        p_user_id: bid.user_id,
        p_item_id: itemId,
        p_amount: 0
      }).catch(() => {}); // If fails, refund below

      // Direct refund via points_transactions
      await supabaseAdmin.from('points_transactions').insert({
        user_id: bid.user_id,
        points: bid.bid_amount,
        transaction_type: 'bid_refund',
        description: `Auction cancelled: ${item.title}`,
        reference_id: itemId,
      });

      // Restore user points directly
      await supabaseAdmin.rpc('add_dag_points', {
        p_user_id: bid.user_id,
        p_points: bid.bid_amount,
        p_transaction_type: 'bid_refund',
        p_description: `Auction cancelled & refunded: ${item.title}`,
        p_reference_id: itemId,
      });

      await supabaseAdmin.from('bids').update({ status: 'refunded' }).eq('id', bid.id);
    }

    await supabaseAdmin
      .from('bid_items')
      .update({ status: 'cancelled' })
      .eq('id', itemId);

    return NextResponse.json({ success: true, refunded: activeBids?.length || 0 });
  } catch (err) {
    console.error('[bidding/admin DELETE]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
