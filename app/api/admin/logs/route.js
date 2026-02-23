import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth';

/**
 * GET /api/admin/logs
 * Returns paginated activity logs with optional filters.
 * Query params:
 *   page       (default 1)
 *   limit      (default 50)
 *   category   (auth|rewards|sales|referral|admin|system|all)
 *   severity   (info|warning|error|critical|all)
 *   search     (searches description, actor_email, target_email, event_type)
 *   from       (ISO date)
 *   to         (ISO date)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit    = Math.min(200, parseInt(searchParams.get('limit') || '50'));
    const category = searchParams.get('category') || 'all';
    const severity = searchParams.get('severity') || 'all';
    const search   = (searchParams.get('search') || '').trim();
    const from     = searchParams.get('from');
    const to       = searchParams.get('to');
    const offset   = (page - 1) * limit;

    const supabase = supabaseAdmin;

    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category !== 'all') query = query.eq('category', category);
    if (severity !== 'all') query = query.eq('severity', severity);
    if (from)               query = query.gte('created_at', from);
    if (to)                 query = query.lte('created_at', to + 'T23:59:59Z');
    if (search) {
      query = query.or(
        `description.ilike.%${search}%,actor_email.ilike.%${search}%,target_email.ilike.%${search}%,event_type.ilike.%${search}%,actor_name.ilike.%${search}%`
      );
    }

    const { data: logs, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      logs: logs || [],
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Logs API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/logs
 * Manually insert an activity log entry (for API-level events not covered by DB triggers).
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { event_type, category, actor_id, actor_email, actor_name, target_id, target_email, target_name, description, metadata, severity, ip_address } = body;

    if (!event_type || !category || !description) {
      return NextResponse.json({ error: 'event_type, category, and description are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .insert({
        event_type, category,
        actor_id:    actor_id    || null,
        actor_email: actor_email || null,
        actor_name:  actor_name  || null,
        target_id:   target_id   || null,
        target_email:target_email|| null,
        target_name: target_name || null,
        description,
        metadata:    metadata    || {},
        severity:    severity    || 'info',
        ip_address:  ip_address  || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, log: data });
  } catch (error) {
    console.error('Log insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
