import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/rewards/redeem
 * Redeem DAG Points for DGCC Coins (DAGChain Coin).
 *
 * Ratio: Configurable via rewards_config.dgcc_points_ratio (default 2500)
 *   2500 DAG Points → 1 DGCC Coin
 *
 * Body: { user_email, redemption_type, amount }
 *   redemption_type: 'dgcc' (only supported type)
 *   amount: number of DGCC Coins desired
 */

const DEFAULT_DGCC_RATIO = 2500; // fallback if config not loaded

export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { user_email, redemption_type, amount } = await request.json();

    if (!user_email || !redemption_type || !amount) {
      return NextResponse.json(
        { error: 'user_email, redemption_type, and amount are required' },
        { status: 400 }
      );
    }

    // Only DGCC is supported
    if (redemption_type !== 'dgcc') {
      return NextResponse.json(
        { error: 'Invalid redemption_type. Only "dgcc" is supported.' },
        { status: 400 }
      );
    }

    const outputAmount = Number(amount);
    if (!Number.isInteger(outputAmount) || outputAmount <= 0) {
      return NextResponse.json(
        { error: 'amount must be a positive integer' },
        { status: 400 }
      );
    }

    // Fetch dgcc_points_ratio from rewards_config
    let dgccRatio = DEFAULT_DGCC_RATIO;
    try {
      const { data: ratioConfig } = await supabase
        .from('rewards_config')
        .select('config_value')
        .eq('config_key', 'dgcc_points_ratio')
        .single();
      if (ratioConfig?.config_value) {
        dgccRatio = parseInt(ratioConfig.config_value, 10) || DEFAULT_DGCC_RATIO;
      }
    } catch {
      // Fallback to default if config unavailable
    }

    const pointsCost = outputAmount * dgccRatio;

    // Fetch user with current balances
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, total_points_earned, total_points_burned, dgcc_balance')
      .eq('email', user_email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const availablePoints = (user.total_points_earned || 0) - (user.total_points_burned || 0);

    if (availablePoints < pointsCost) {
      return NextResponse.json({
        error: 'Insufficient DAG Points',
        required: pointsCost,
        available: availablePoints,
        deficit: pointsCost - availablePoints,
      }, { status: 400 });
    }

    // Deduct DAG Points via add_dag_points RPC (negative = deduct)
    const { error: burnError } = await supabase.rpc('add_dag_points', {
      p_user_id:          user.id,
      p_points:           -pointsCost,
      p_transaction_type: 'redeemed',
      p_description:      `Redeemed ${pointsCost} DAG Points for ${outputAmount} DGCC Coin${outputAmount > 1 ? 's' : ''}`,
      p_reference_id:     null,
    });

    if (burnError) {
      console.error('Redeem burn error:', burnError);
      return NextResponse.json(
        { error: 'Failed to deduct points', details: burnError.message },
        { status: 500 }
      );
    }

    // Add DGCC coins to user balance
    const newDgccBalance = (user.dgcc_balance || 0) + outputAmount;
    const { error: dgccUpdateError } = await supabase
      .from('users')
      .update({ dgcc_balance: newDgccBalance })
      .eq('id', user.id);

    if (dgccUpdateError) {
      console.error('DGCC balance update error:', dgccUpdateError);
      // Points already deducted — log but don't fail silently
      // In production, a reconciliation job would handle this
    }

    // Record in point_redemptions table
    await supabase.from('point_redemptions').insert({
      user_id:        user.id,
      redemption_type: 'dgcc',
      points_spent:   pointsCost,
      output_amount:  outputAmount,
      output_unit:    'coin',
      status:         'completed',
    });

    return NextResponse.json({
      success:          true,
      message:          `Successfully redeemed ${pointsCost} DAG Points for ${outputAmount} DGCC Coin${outputAmount > 1 ? 's' : ''}`,
      pointsSpent:      pointsCost,
      outputAmount,
      outputLabel:      'DGCC Coins',
      availablePoints:  availablePoints - pointsCost,
      dgcc_balance:     newDgccBalance,
      dgcc_ratio:       dgccRatio,
    });

  } catch (error) {
    console.error('Redeem API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
