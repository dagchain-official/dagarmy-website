import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

    // Fetch updated user data
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select('tier, dag_points, total_points_earned, upgraded_at')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

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
