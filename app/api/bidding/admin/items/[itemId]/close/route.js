import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/admin-auth';

// POST /api/bidding/admin/items/[itemId]/close - manually close auction
export async function POST(request, { params }) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { itemId } = params;

    const { data, error } = await supabaseAdmin.rpc('close_auction', {
      p_item_id: itemId,
    });

    if (error) throw error;

    if (!data?.ok) {
      return NextResponse.json({ error: data?.error || 'Close failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      winners: data.winners,
      item_id: itemId,
    });
  } catch (err) {
    console.error('[bidding/admin/close POST]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
