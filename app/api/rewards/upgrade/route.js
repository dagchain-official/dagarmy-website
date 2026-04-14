import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp-client';
import { lieutenantUpgradeEmailTemplate } from '@/lib/email-templates';
import { notifyLieutenantUpgrade } from '@/services/dagchainWebhook';

const RANK_ORDER = [
  'INITIATOR', 'VANGUARD', 'GUARDIAN', 'STRIKER', 'INVOKER',
  'COMMANDER', 'CHAMPION', 'CONQUEROR', 'PARAGON', 'MYTHIC'
];

// POST - Upgrade user to DAG LIEUTENANT (or burn points for rank upgrade)
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { payment_id, action, user_email, wallet_address } = body;

    // ── Rank burn branch ──
    if (action === 'rank_burn') {
      if (!user_email && !wallet_address) {
        return NextResponse.json({ error: 'user_email or wallet_address is required' }, { status: 400 });
      }
      let q = supabase.from('users').select('id, current_rank, total_points_earned, total_points_burned');
      q = user_email ? q.eq('email', user_email) : q.eq('wallet_address', wallet_address.toLowerCase());
      const { data: rankUser, error: rankUserError } = await q.single();
      if (rankUserError || !rankUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      const currentRank = rankUser.current_rank || 'None';
      const currentIndex = currentRank === 'None' ? -1 : RANK_ORDER.indexOf(currentRank);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= RANK_ORDER.length) return NextResponse.json({ error: 'Already at maximum rank (MYTHIC)' }, { status: 400 });

      const nextRank = RANK_ORDER[nextIndex];
      const { data: burnConfig } = await supabase.from('rewards_config').select('config_value').eq('config_key', 'rank_burn_' + nextRank.toLowerCase()).single();
      if (!burnConfig) return NextResponse.json({ error: `Burn config not found for ${nextRank}` }, { status: 500 });

      const burnCost = burnConfig.config_value;
      const available = (rankUser.total_points_earned || 0) - (rankUser.total_points_burned || 0);
      if (available < burnCost) return NextResponse.json({ error: 'Insufficient DAG Points', required: burnCost, available, deficit: burnCost - available }, { status: 400 });

      const { error: rankBurnError } = await supabase.rpc('add_dag_points', { p_user_id: rankUser.id, p_points: -burnCost, p_transaction_type: 'rank_burn', p_description: `Burned ${burnCost} DAG Points to achieve ${nextRank} rank`, p_reference_id: null });
      if (rankBurnError) return NextResponse.json({ error: 'Failed to burn points', details: rankBurnError.message }, { status: 500 });

      const { error: rankUpdateError } = await supabase.from('users').update({ current_rank: nextRank }).eq('id', rankUser.id);
      if (rankUpdateError) return NextResponse.json({ error: 'Points burned but rank update failed', details: rankUpdateError.message }, { status: 500 });

      return NextResponse.json({ success: true, message: `Upgraded to ${nextRank}!`, previousRank: currentRank, newRank: nextRank, pointsBurned: burnCost, availablePoints: available - burnCost });
    }

    // ── Lieutenant upgrade branch ──
    // Get user ID from request headers
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check current user tier
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tier, dag_points')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    if (userData.tier === 'DAG_LIEUTENANT') {
      return NextResponse.json({ 
        error: 'User is already a DAG LIEUTENANT' 
      }, { status: 400 });
    }

    // Call the upgrade function
    const { error: upgradeError } = await supabase.rpc('upgrade_to_lieutenant', {
      p_user_id: userId,
      p_payment_id: payment_id || null
    });

    if (upgradeError) throw upgradeError;

    // Award referral upgrade points to the upline (Scenario 2 or 4)
    // This is a fire-and-forget call — don't block the upgrade response
    try {
      const baseUrl = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      await fetch(`${protocol}://${baseUrl}/api/referral/upgrade-reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upgradedUserId: userId })
      });
    } catch (refErr) {
      console.error('Non-blocking: Failed to award referral upgrade points:', refErr);
    }

    // Notify DAGChain of Lieutenant upgrade (fire-and-forget)
    // Do this before we fetch updatedUser so we use the userId + payment_id
    notifyLieutenantUpgrade({ id: userId, email: null }, payment_id || null);

    // Fetch updated user data (include email + name for the confirmation email)
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select('tier, dag_points, total_points_earned, upgraded_at, email, full_name, username')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Send lieutenant upgrade confirmation email (fire-and-forget)
    if (updatedUser?.email) {
      const displayName = updatedUser.full_name || updatedUser.username || 'Soldier';
      sendEmail('support@dagchain.network', {
        to: updatedUser.email,
        subject: 'Congratulations! You are now a DAG Lieutenant',
        html: lieutenantUpgradeEmailTemplate({ userName: displayName }),
      }).catch(err => console.error('Lieutenant upgrade email failed (non-blocking):', err));
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully upgraded to DAG LIEUTENANT!',
      user: updatedUser
    }, { status: 200 });
  } catch (error) {
    console.error('Error upgrading to lieutenant:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
