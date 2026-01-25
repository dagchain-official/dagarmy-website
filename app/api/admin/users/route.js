import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request) {
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

    // Calculate statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(user => {
      // Consider users active if they've logged in within the last 30 days
      const lastActive = new Date(user.last_sign_in_at || user.created_at);
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

    // Calculate growth (users created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = users.filter(user => 
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
        activeUsers,
        usersByRole,
        newUsersThisWeek,
        weeklyGrowth,
        growthRate: totalUsers > 0 ? ((newUsersThisWeek / totalUsers) * 100).toFixed(1) : 0
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
