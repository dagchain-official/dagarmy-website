import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/cron/auction-alerts
// Called by Vercel Cron every 15 minutes.
// 1. Activates upcoming auctions whose starts_at has passed
// 2. Closes active auctions whose ends_at has passed
// 3. Sends admin notifications at key milestones (24h, 12h, 6h, 1h, 15min left)
export async function GET(request) {
  // Verify cron secret to prevent public access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const results = { activated: 0, closed: 0, notifications: 0 };

    // ── 1. Activate pending auctions ────────────────────────────
    const { data: toActivate } = await supabaseAdmin
      .from('bid_items')
      .select('id, title')
      .eq('status', 'upcoming')
      .lte('starts_at', now.toISOString());

    for (const item of toActivate || []) {
      await supabaseAdmin.from('bid_items').update({ status: 'active' }).eq('id', item.id);

      // Notify admins that auction went live
      await supabaseAdmin.from('notifications').insert({
        title: `🔴 Auction is LIVE: ${item.title}`,
        message: 'The auction has officially started. Users can now place bids.',
        type: 'success', priority: 'high', target_role: 'admin',
        action_url: `/admin/bidding/${item.id}`, icon: '🔴',
      });
      results.activated++;
    }

    // ── 2. Close expired active auctions ──────────────────────────
    const { data: toClose } = await supabaseAdmin
      .from('bid_items')
      .select('id, title')
      .eq('status', 'active')
      .lte('ends_at', now.toISOString());

    for (const item of toClose || []) {
      await supabaseAdmin.rpc('close_auction', { p_item_id: item.id });
      results.closed++;
    }

    // ── 3. Milestone notifications ─────────────────────────────────
    // Check active auctions for time milestones
    const MILESTONES_MS = [
      { ms: 24 * 60 * 60 * 1000, label: '24 hours' },
      { ms: 12 * 60 * 60 * 1000, label: '12 hours' },
      { ms: 6  * 60 * 60 * 1000, label: '6 hours'  },
      { ms: 60 * 60 * 1000,      label: '1 hour'    },
      { ms: 15 * 60 * 1000,      label: '15 minutes' },
    ];
    const CRON_INTERVAL_MS = 15 * 60 * 1000; // 15 min cron window

    const { data: activeItems } = await supabaseAdmin
      .from('bid_items')
      .select(`
        id, title, ends_at,
        current_highest_bid, current_highest_bidder_id,
        total_bids_count
      `)
      .eq('status', 'active')
      .gt('ends_at', now.toISOString());

    for (const item of activeItems || []) {
      const msLeft = new Date(item.ends_at).getTime() - now.getTime();

      for (const milestone of MILESTONES_MS) {
        // Fire if within this cron window of the milestone
        if (msLeft <= milestone.ms && msLeft > milestone.ms - CRON_INTERVAL_MS) {
          // Fetch highest bidder name
          let bidderName = 'No bids yet';
          if (item.current_highest_bidder_id) {
            const { data: bidder } = await supabaseAdmin
              .from('users')
              .select('full_name')
              .eq('id', item.current_highest_bidder_id)
              .single();
            if (bidder) bidderName = bidder.full_name;
          }

          await supabaseAdmin.from('notifications').insert({
            title: `⏰ ${milestone.label} left — ${item.title}`,
            message: `Highest bid: ${item.current_highest_bid} DAG Points by ${bidderName} | Total bidders: ${item.total_bids_count}`,
            type: 'warning',
            priority: milestone.ms <= 60 * 60 * 1000 ? 'urgent' : 'high',
            target_role: 'admin',
            action_url: `/admin/bidding/${item.id}`,
            icon: '⏰',
          });
          results.notifications++;
        }
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (err) {
    console.error('[cron/auction-alerts]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
