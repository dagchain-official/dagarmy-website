import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '@/lib/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const guard = await requirePermission(request, 'users.read');
  if (guard) return guard;

  try {
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setHours(0,0,0,0);
    const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now); startOfMonth.setDate(now.getDate() - 30);

    const [
      totalUsersRes,
      newTodayRes,
      newWeekRes,
      newMonthRes,
      activeMonthRes,
      openTicketsRes,
      resolvedWeekRes,
      certThisMonthRes,
      recentUsersRes,
      recentTicketsRes,
      monthlySignupsRes,
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('created_at', startOfToday.toISOString()),
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('created_at', startOfWeek.toISOString()),
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()),
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('last_sign_in_at', startOfMonth.toISOString()),
      supabase.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open','in_progress']),
      supabase.from('support_tickets').select('id', { count: 'exact', head: true }).eq('status','resolved').gte('updated_at', startOfWeek.toISOString()),
      supabase.from('certifications').select('id', { count: 'exact', head: true }).gte('issued_at', startOfMonth.toISOString()),
      supabase.from('users').select('id, full_name, email, created_at, role, avatar_url').order('created_at', { ascending: false }).limit(8),
      supabase.from('support_tickets').select('id, subject, status, created_at, user_id').order('created_at', { ascending: false }).limit(6),
      // Last 6 months signup counts
      supabase.from('users').select('created_at').gte('created_at', new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()),
    ]);

    // Build monthly signup chart data (last 6 months)
    const monthlyMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      monthlyMap[key] = 0;
    }
    (monthlySignupsRes.data || []).forEach(u => {
      const d = new Date(u.created_at);
      const key = d.toLocaleString('default', { month: 'short' });
      if (monthlyMap[key] !== undefined) monthlyMap[key]++;
    });

    return NextResponse.json({
      stats: {
        totalUsers:      totalUsersRes.count  ?? 0,
        newToday:        newTodayRes.count     ?? 0,
        newThisWeek:     newWeekRes.count      ?? 0,
        newThisMonth:    newMonthRes.count     ?? 0,
        activeThisMonth: activeMonthRes.count  ?? 0,
        openTickets:     openTicketsRes.count  ?? 0,
        resolvedThisWeek:resolvedWeekRes.count ?? 0,
        certsThisMonth:  certThisMonthRes.count?? 0,
      },
      recentUsers:   recentUsersRes.data   || [],
      recentTickets: recentTicketsRes.data || [],
      monthlySignups: Object.entries(monthlyMap).map(([month, count]) => ({ month, count })),
    });
  } catch (err) {
    console.error('hr-stats error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
