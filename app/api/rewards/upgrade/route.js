import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/smtp-client';
import { lieutenantUpgradeEmailTemplate } from '@/lib/email-templates';

// POST - Upgrade user to DAG LIEUTENANT
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { payment_id } = body;

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
