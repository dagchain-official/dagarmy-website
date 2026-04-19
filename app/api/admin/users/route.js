import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '@/lib/admin-auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request) {
  const guard = await requirePermission(request, 'users.read');
  if (guard) return guard;
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all users with their profile data
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users', details: error.message },
        { status: 500 }
      );
    }

    // Fetch all referral relationships to attach upline info
    const { data: referrals } = await supabase
      .from('referrals')
      .select('referrer_id, referred_id, referral_code');

    // Build a map: referred_id -> { referrer_id, referral_code }
    const referralMap = {};
    referrals?.forEach(r => {
      referralMap[r.referred_id] = { referrer_id: r.referrer_id, referral_code: r.referral_code };
    });

    // Build a map: user_id -> user basic info (for referrer lookup)
    const userMap = {};
    users.forEach(u => {
      userMap[u.id] = { full_name: u.full_name, first_name: u.first_name, last_name: u.last_name, email: u.email, id: u.id };
    });

    // Attach upline info to each user
    users.forEach(u => {
      const ref = referralMap[u.id];
      if (ref) {
        const referrer = userMap[ref.referrer_id];
        const referrerName = referrer?.full_name
          || [referrer?.first_name, referrer?.last_name].filter(Boolean).join(' ')
          || referrer?.email
          || (referrer?.id ? `User ${referrer.id.slice(0, 6)}` : 'No upline');
        u.upline = {
          referrer_id: ref.referrer_id,
          referrer_name: referrerName,
          referrer_email: referrer?.email || 'N/A',
          referral_code: ref.referral_code
        };
      } else {
        u.upline = null;
      }
    });

    // Calculate statistics
    const totalUsers = users.length;
    const studentUsers = users.filter(u => (u.role || 'student') === 'student');
    const totalStudents = studentUsers.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;

    const activeUsers = users.filter(user => {
      const lastActive = new Date(user.last_login || user.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastActive > thirtyDaysAgo;
    }).length;

    const activeStudents = studentUsers.filter(user => {
      const lastActive = new Date(user.last_login || user.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastActive > thirtyDaysAgo;
    }).length;

    // Group users by role
    const usersByRole = users.reduce((acc, user) => {
      const role = user.role || 'student';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    // Calculate growth (users created in last 7 days) - students only
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = studentUsers.filter(user =>
      new Date(user.created_at) > sevenDaysAgo
    ).length;

    // Calculate growth by week for the last 4 weeks
    const weeklyGrowth = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (7 * (i + 1)));
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (7 * i));
      
      const usersInWeek = users.filter(user => {
        const createdAt = new Date(user.created_at);
        return createdAt >= weekStart && createdAt < weekEnd;
      }).length;
      
      weeklyGrowth.unshift(usersInWeek);
    }

    return NextResponse.json({
      users,
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        activeUsers,
        activeStudents,
        usersByRole,
        newUsersThisWeek,
        weeklyGrowth,
        growthRate: totalStudents > 0 ? ((newUsersThisWeek / totalStudents) * 100).toFixed(1) : 0
      }
    });

  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
