import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/rewards/rank-upgrade
 * Burns DAG Points to upgrade the user's rank to the next level.
 * 
 * Rank progression is sequential:
 *   None -> INITIATOR -> VANGUARD -> GUARDIAN -> STRIKER -> INVOKER ->
 *   COMMANDER -> CHAMPION -> CONQUEROR -> PARAGON -> MYTHIC
 * 
 * Each rank requires a fresh burn of DAG Points (not cumulative).
 * Body: { user_email }
 */

const RANK_ORDER = [
  'INITIATOR', 'VANGUARD', 'GUARDIAN', 'STRIKER', 'INVOKER',
  'COMMANDER', 'CHAMPION', 'CONQUEROR', 'PARAGON', 'MYTHIC'
];

export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { user_email } = await request.json();

    if (!user_email) {
      return NextResponse.json({ error: 'user_email is required' }, { status: 400 });
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, tier, current_rank, total_points_earned, total_points_burned')
      .eq('email', user_email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Determine next rank
    const currentRank = user.current_rank || 'None';
    const currentRankIndex = currentRank === 'None' ? -1 : RANK_ORDER.indexOf(currentRank);

    if (currentRankIndex === -1 && currentRank !== 'None') {
      return NextResponse.json({ error: 'Invalid current rank' }, { status: 400 });
    }

    const nextRankIndex = currentRankIndex + 1;
    if (nextRankIndex >= RANK_ORDER.length) {
      return NextResponse.json({ error: 'Already at maximum rank (MYTHIC)' }, { status: 400 });
    }

    const nextRank = RANK_ORDER[nextRankIndex];
    const burnConfigKey = 'rank_burn_' + nextRank.toLowerCase();

    // Fetch burn requirement from config
    const { data: burnConfig } = await supabase
      .from('rewards_config')
      .select('config_value')
      .eq('config_key', burnConfigKey)
      .single();

    if (!burnConfig) {
      return NextResponse.json({ error: `Burn config not found for ${nextRank}` }, { status: 500 });
    }

    const burnCost = burnConfig.config_value;
    const availablePoints = (user.total_points_earned || 0) - (user.total_points_burned || 0);

    if (availablePoints < burnCost) {
      return NextResponse.json({
        error: 'Insufficient DAG Points',
        required: burnCost,
        available: availablePoints,
        deficit: burnCost - availablePoints
      }, { status: 400 });
    }

    // Burn points via add_dag_points with negative amount
    const { error: burnError } = await supabase.rpc('add_dag_points', {
      p_user_id: user.id,
      p_points: -burnCost,
      p_transaction_type: 'rank_burn',
      p_description: `Burned ${burnCost} DAG Points to achieve ${nextRank} rank`,
      p_reference_id: null
    });

    if (burnError) {
      console.error('Error burning points for rank upgrade:', burnError);
      return NextResponse.json({ error: 'Failed to burn points', details: burnError.message }, { status: 500 });
    }

    // Update user's current_rank
    const { error: updateError } = await supabase
      .from('users')
      .update({ current_rank: nextRank })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user rank:', updateError);
      return NextResponse.json({ error: 'Points burned but rank update failed', details: updateError.message }, { status: 500 });
    }

    const newAvailable = availablePoints - burnCost;

    return NextResponse.json({
      success: true,
      message: `Upgraded to ${nextRank}!`,
      previousRank: currentRank,
      newRank: nextRank,
      pointsBurned: burnCost,
      availablePoints: newAvailable
    });

  } catch (error) {
    console.error('Exception in rank-upgrade API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
