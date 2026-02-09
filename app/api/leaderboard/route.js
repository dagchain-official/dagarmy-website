import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error', leaderboard: [] },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('filter') || 'all-time';
    const currentUserId = searchParams.get('userId');

    console.log('Leaderboard API called:', { timeFilter, currentUserId });

    // Calculate date range based on filter
    let dateFilter = null;
    let dateFilterEnd = null;
    const now = new Date();
    
    if (timeFilter === 'this-week' || timeFilter === 'week-1') {
      // This week (last 7 days)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      dateFilter = weekStart.toISOString();
    } else if (timeFilter === 'week-2') {
      // Last week (8-14 days ago)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      dateFilter = weekStart.toISOString();
      dateFilterEnd = weekEnd.toISOString();
    } else if (timeFilter === 'week-3') {
      // 2 weeks ago (15-21 days ago)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - 14);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      dateFilter = weekStart.toISOString();
      dateFilterEnd = weekEnd.toISOString();
    } else if (timeFilter === 'week-4') {
      // 3 weeks ago (22-28 days ago)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - 21);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      dateFilter = weekStart.toISOString();
      dateFilterEnd = weekEnd.toISOString();
    } else if (timeFilter === 'this-month' || timeFilter === 'month-1') {
      // This month
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = monthStart.toISOString();
    } else if (timeFilter === 'month-2') {
      // Last month
      const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = monthStart.toISOString();
      dateFilterEnd = monthEnd.toISOString();
    } else if (timeFilter === 'month-3') {
      // 2 months ago
      const monthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      dateFilter = monthStart.toISOString();
      dateFilterEnd = monthEnd.toISOString();
    }

    // Build query for leaderboard
    let query = supabase
      .from('users')
      .select(`
        id,
        full_name,
        avatar_url,
        dag_points,
        total_points_earned,
        tier,
        created_at
      `)
      .eq('role', 'student')
      .order('dag_points', { ascending: false })
      .order('created_at', { ascending: true }); // Tie-breaker: earlier signup ranks higher

    // For time-based filters, we need to calculate points from transactions
    if (dateFilter) {
      console.log('Filtering by date:', dateFilter);
      
      // Get users with their points from transactions in the time period
      let txQuery = supabase
        .from('points_transactions')
        .select('user_id, points, created_at')
        .gte('created_at', dateFilter);
      
      // If we have an end date, filter transactions within the range
      if (dateFilterEnd) {
        txQuery = txQuery.lt('created_at', dateFilterEnd);
      }
      
      const { data: transactions, error: txError } = await txQuery;

      if (txError) {
        console.error('Transaction query error:', txError);
        throw txError;
      }

      console.log(`Found ${transactions?.length || 0} transactions since ${dateFilter}`);
      if (transactions && transactions.length > 0) {
        console.log('Sample transaction:', transactions[0]);
      }

      // Aggregate points by user
      const userPoints = {};
      transactions.forEach(tx => {
        if (!userPoints[tx.user_id]) {
          userPoints[tx.user_id] = 0;
        }
        userPoints[tx.user_id] += tx.points;
      });

      console.log('User points aggregated:', userPoints);

      // Get user details for those who earned points in this period
      const userIds = Object.keys(userPoints);
      if (userIds.length === 0) {
        console.log('No users found with points in this period');
        return NextResponse.json({ leaderboard: [], currentUserRank: null, timeFilter });
      }

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          avatar_url,
          tier,
          created_at
        `)
        .in('id', userIds)
        .eq('role', 'student');

      if (usersError) throw usersError;

      // Combine user data with period points
      const leaderboardData = users.map(user => ({
        ...user,
        dag_points: userPoints[user.id] || 0
      }));

      // Sort by points (desc) and created_at (asc) for tie-breaking
      leaderboardData.sort((a, b) => {
        if (b.dag_points !== a.dag_points) {
          return b.dag_points - a.dag_points;
        }
        return new Date(a.created_at) - new Date(b.created_at);
      });

      // Add rank and format data
      const formattedData = leaderboardData.map((user, index) => ({
        rank: index + 1,
        id: user.id,
        name: user.full_name || 'Anonymous User',
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=6366f1&color=fff`,
        points: user.dag_points,
        tier: user.tier,
        isCurrentUser: user.id === currentUserId,
        achievedAt: user.created_at
      }));

      // Find current user's rank
      const currentUserRank = formattedData.find(u => u.id === currentUserId)?.rank || null;

      return NextResponse.json({
        leaderboard: formattedData.slice(0, 50), // Top 50
        currentUserRank,
        timeFilter
      });
    }

    // For all-time, use dag_points directly
    console.log('Fetching all-time leaderboard...');
    const { data: users, error } = await query.limit(50);

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log(`Found ${users?.length || 0} users`);

    // Format the data
    const leaderboardData = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.full_name || 'Anonymous User',
      avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=6366f1&color=fff`,
      points: user.dag_points || 0,
      tier: user.tier,
      isCurrentUser: user.id === currentUserId,
      achievedAt: user.created_at
    }));

    // Find current user's rank
    const currentUserRank = leaderboardData.find(u => u.id === currentUserId)?.rank || null;

    console.log('Returning leaderboard data successfully');

    return NextResponse.json({
      leaderboard: leaderboardData,
      currentUserRank,
      timeFilter
    });

  } catch (error) {
    console.error('Leaderboard API Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data', details: error.message, leaderboard: [] },
      { status: 500 }
    );
  }
}
