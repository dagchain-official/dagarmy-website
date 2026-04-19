import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/referral/tree?userId=<uuid>
 * Returns the full referral downline tree for the given user.
 * Each node contains user details + their children (recursive).
 * Max depth: 6 levels to prevent runaway queries.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Fetch ALL referrals in one query (referrer_id, referred_id, status, reward_points, created_at)
    // Then join with users to get names/tiers in a second query
    // This is more efficient than recursive per-level queries

    // Step 1: Get all referral relationships (no depth limit needed - we'll BFS in JS)
    const { data: allReferrals, error: refError } = await supabaseAdmin
      .from('referrals')
      .select('referrer_id, referred_id, status, reward_points, created_at, total_points_earned');

    if (refError) {
      console.error('Error fetching referrals:', refError);
      return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
    }

    if (!allReferrals || allReferrals.length === 0) {
      return NextResponse.json({ success: true, tree: null });
    }

    // Step 2: Collect all unique user IDs that appear in the downline of userId
    // BFS from userId to find all descendants
    const referralMap = {}; // referrer_id -> [{ referred_id, status, reward_points, created_at }]
    for (const r of allReferrals) {
      if (!referralMap[r.referrer_id]) referralMap[r.referrer_id] = [];
      referralMap[r.referrer_id].push(r);
    }

    // Collect all descendant user IDs via BFS
    const allDescendantIds = new Set();
    const queue = [userId];
    const MAX_DEPTH = 6;
    let depth = 0;
    const levelMap = { [userId]: 0 };

    while (queue.length > 0 && depth < MAX_DEPTH) {
      const current = queue.shift();
      const currentDepth = levelMap[current] ?? 0;
      if (currentDepth >= MAX_DEPTH) continue;

      const children = referralMap[current] || [];
      for (const child of children) {
        if (!allDescendantIds.has(child.referred_id)) {
          allDescendantIds.add(child.referred_id);
          levelMap[child.referred_id] = currentDepth + 1;
          queue.push(child.referred_id);
        }
      }
      depth = Math.max(depth, currentDepth);
    }

    // Step 3: Fetch user details for root + all descendants in one query
    const allUserIds = [userId, ...Array.from(allDescendantIds)];
    const { data: usersData, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email, tier, current_rank, created_at, avatar_url')
      .in('id', allUserIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }

    // Build user lookup map
    const userMap = {};
    for (const u of (usersData || [])) {
      userMap[u.id] = u;
    }

    // Step 4: Recursively build tree from root
    function buildNode(uid, currentDepth) {
      if (currentDepth > MAX_DEPTH) return null;
      const u = userMap[uid];
      if (!u) return null;

      const childReferrals = referralMap[uid] || [];
      const children = [];
      for (const ref of childReferrals) {
        if (allDescendantIds.has(ref.referred_id) || ref.referred_id !== userId) {
          const childNode = buildNode(ref.referred_id, currentDepth + 1);
          if (childNode) {
            children.push({
              ...childNode,
              referralStatus: ref.status,
              pointsEarned: ref.total_points_earned || ref.reward_points || 0,
              joinedViaReferralAt: ref.created_at,
            });
          }
        }
      }

      return {
        id: u.id,
        name: u.full_name || 'Unknown',
        email: u.email ? u.email.replace(/(.{2}).*(@.*)/, '$1***$2') : '-',
        tier: u.tier || 'DAG SOLDIER',
        rank: u.current_rank || 'None',
        joinedAt: u.created_at,
        depth: currentDepth,
        children,
      };
    }

    const tree = buildNode(userId, 0);

    // Step 5: Compute summary stats
    const totalNodes = allDescendantIds.size;
    const maxDepthReached = Math.max(0, ...Array.from(allDescendantIds).map(id => levelMap[id] || 0));

    return NextResponse.json({
      success: true,
      tree,
      meta: {
        totalDownline: totalNodes,
        maxDepth: maxDepthReached,
      }
    });

  } catch (error) {
    console.error('Exception in referral tree API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
