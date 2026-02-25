import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import redis from '@/lib/redis';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CACHE_KEY = 'admin:counts';
const CACHE_TTL = 120; // 2 minutes

export async function GET() {
  try {
    // Serve from Redis cache if available
    const cached = await redis.get(CACHE_KEY);
    if (cached) return NextResponse.json(cached);

    const [users, courses, certifications, events, logs, notifications, assignments, support_open, pending_withdrawals] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('courses').select('id', { count: 'exact', head: true }),
      supabase.from('certifications').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('activity_logs').select('id', { count: 'exact', head: true }),
      supabase.from('notifications').select('id', { count: 'exact', head: true }),
      supabase.from('assignments').select('id', { count: 'exact', head: true }),
      supabase.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
      supabase.from('withdrawal_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const result = {
      users:                users.count                ?? 0,
      courses:              courses.count              ?? 0,
      certifications:       certifications.count       ?? 0,
      events:               events.count               ?? 0,
      logs:                 logs.count                 ?? 0,
      notifications:        notifications.count        ?? 0,
      assignments:          assignments.count          ?? 0,
      support_open:         support_open.count         ?? 0,
      pending_withdrawals:  pending_withdrawals.count  ?? 0,
    };

    await redis.set(CACHE_KEY, result, { ex: CACHE_TTL });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
