import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch user's points and transaction history
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;

    // Get user ID from request headers
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user points
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('dag_points, total_points_earned, tier, upgraded_at')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Fetch transaction history
    const { data: transactions, error: transError } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (transError) throw transError;

    return NextResponse.json({ 
      points: userData.dag_points,
      total_earned: userData.total_points_earned,
      tier: userData.tier,
      upgraded_at: userData.upgraded_at,
      transactions
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching points:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST - Add points to user (Admin only for manual adjustments)
export async function POST(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { user_id, points, transaction_type, description, reference_id } = body;

    // Get user ID from request headers
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or master admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, is_master_admin')
      .eq('id', userId)
      .single();

    if (userError || (!userData?.is_master_admin && userData?.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Add points using the database function
    const { error: addError } = await supabase.rpc('add_dag_points', {
      p_user_id: user_id,
      p_points: points,
      p_transaction_type: transaction_type,
      p_description: description || null,
      p_reference_id: reference_id || null
    });

    if (addError) throw addError;

    return NextResponse.json({ 
      success: true,
      message: `Successfully added ${points} DAG Points`
    }, { status: 200 });
  } catch (error) {
    console.error('Error adding points:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
