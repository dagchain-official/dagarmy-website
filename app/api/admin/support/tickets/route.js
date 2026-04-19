import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/admin/support/tickets?status=&priority=&category=&search=&page=&limit=
export async function GET(request) {
  const guard = await requirePermission(request, 'support.read');
  if (guard) return guard;
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (category) query = query.eq('category', category);
    if (search) {
      query = query.or(
        `ticket_number.ilike.%${search}%,user_email.ilike.%${search}%,subject.ilike.%${search}%`
      );
    }

    const { data: tickets, error, count } = await query;
    if (error) throw error;

    // Fetch open count for badge
    const { count: openCount } = await supabase
      .from('support_tickets')
      .select('id', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress']);

    return NextResponse.json({
      success: true,
      tickets: tickets || [],
      total: count || 0,
      page,
      limit,
      openCount: openCount || 0,
    });
  } catch (err) {
    console.error('GET /api/admin/support/tickets error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/support/tickets - update ticket (status, priority, assigned_to)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, priority, assigned_to } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updates = { updated_at: new Date().toISOString() };
    if (status !== undefined) {
      updates.status = status;
      if (status === 'resolved' || status === 'closed') {
        updates.resolved_at = new Date().toISOString();
      }
    }
    if (priority !== undefined) updates.priority = priority;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;

    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    console.error('PATCH /api/admin/support/tickets error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
