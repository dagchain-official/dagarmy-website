import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/rewards/redeem
 * Redeem DAG Points for DAGGPT credits or DAGCOIN.
 *
 * Ratios:
 *   DAGGPT  — 5 DAG Points  : 1 DAGGPT Credit
 *   DAGCOIN — 500 DAG Points : 1 DAGCHAIN Gas Coin
 *
 * Body: { user_email, redemption_type, amount }
 *   redemption_type: 'daggpt' | 'dagcoin'
 *   amount: number of OUTPUT units desired (credits or coins)
 */

const REDEMPTION_CONFIG = {
  daggpt:  { ratio: 5,   label: 'DAGGPT Credits',       unit: 'credit',  coin: false },
  dagcoin: { ratio: 500, label: 'DAGCHAIN Gas Coins',    unit: 'coin',    coin: true  },
};

export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const { user_email, redemption_type, amount } = await request.json();

    if (!user_email || !redemption_type || !amount) {
      return NextResponse.json({ error: 'user_email, redemption_type, and amount are required' }, { status: 400 });
    }

    const config = REDEMPTION_CONFIG[redemption_type];
    if (!config) {
      return NextResponse.json({ error: 'Invalid redemption_type. Must be "daggpt" or "dagcoin"' }, { status: 400 });
    }

    const outputAmount = Number(amount);
    if (!Number.isInteger(outputAmount) || outputAmount <= 0) {
      return NextResponse.json({ error: 'amount must be a positive integer' }, { status: 400 });
    }

    const pointsCost = outputAmount * config.ratio;

    // Fetch user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, total_points_earned, total_points_burned')
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

    // Deduct points via add_dag_points RPC
    const { error: burnError } = await supabase.rpc('add_dag_points', {
      p_user_id:        user.id,
      p_points:         -pointsCost,
      p_transaction_type: 'redeemed',
      p_description:    `Redeemed ${pointsCost} DAG Points for ${outputAmount} ${config.label}`,
      p_reference_id:   null,
    });

    if (burnError) {
      console.error('Redeem burn error:', burnError);
      return NextResponse.json({ error: 'Failed to deduct points', details: burnError.message }, { status: 500 });
    }

    // Record redemption in point_redemptions table (create if needed via upsert-safe insert)
    await supabase.from('point_redemptions').insert({
      user_id:          user.id,
      redemption_type,
      points_spent:     pointsCost,
      output_amount:    outputAmount,
      output_unit:      config.unit,
      status:           'pending',
    }).select();
    // Non-fatal if table doesn't exist yet — redemption is recorded via points_transactions

    return NextResponse.json({
      success:       true,
      message:       `Successfully redeemed ${pointsCost} DAG Points for ${outputAmount} ${config.label}`,
      pointsSpent:   pointsCost,
      outputAmount,
      outputLabel:   config.label,
      availablePoints: availablePoints - pointsCost,
    });

  } catch (error) {
    console.error('Redeem API error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
