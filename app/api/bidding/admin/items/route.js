import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/admin-auth';

// GET /api/bidding/admin/items — all items (all statuses) for admin
export async function GET(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data, error } = await supabaseAdmin
      .from('bid_items')
      .select(`
        id, title, status, starts_at, ends_at,
        starting_bid, min_increment, max_winners,
        current_highest_bid, total_bids_count, total_dag_locked,
        closed_at, created_at, admin_note
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, items: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/bidding/admin/items — create new auction item
export async function POST(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      title, description, features, images,
      starts_at, ends_at, starting_bid, min_increment,
      max_winners = 1, admin_note,
    } = body;

    // Validate required fields
    if (!title || !description || !starts_at || !ends_at || !starting_bid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (new Date(ends_at) <= new Date(starts_at)) {
      return NextResponse.json({ error: 'ends_at must be after starts_at' }, { status: 400 });
    }

    const now = new Date();
    const status = new Date(starts_at) <= now ? 'active' : 'upcoming';

    const { data, error } = await supabaseAdmin
      .from('bid_items')
      .insert({
        title, description,
        features: features || [],
        images: images || [],
        starts_at, ends_at,
        starting_bid: parseInt(starting_bid),
        min_increment: parseInt(min_increment) || 10,
        max_winners: parseInt(max_winners) || 1,
        status,
        admin_note: admin_note || null,
        created_by: session.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Send admin notification for auction creation
    await supabaseAdmin.from('notifications').insert({
      title: `🎯 New Auction Created: ${title}`,
      message: `Auction starts ${new Date(starts_at).toLocaleString()} | Min bid: ${starting_bid} DAG Points`,
      type: 'info',
      priority: 'normal',
      target_role: 'admin',
      action_url: `/admin/bidding/${data.id}`,
      icon: '🎯',
    });

    return NextResponse.json({ success: true, item: data });
  } catch (err) {
    console.error('[bidding/admin/items POST]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
