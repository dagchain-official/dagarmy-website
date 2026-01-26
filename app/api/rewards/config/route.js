import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch all rewards configuration
export async function GET(request) {
  try {
    const supabase = supabaseAdmin;

    const { data: config, error } = await supabase
      .from('rewards_config')
      .select('*')
      .order('config_key');

    if (error) throw error;

    return NextResponse.json({ config }, { status: 200 });
  } catch (error) {
    console.error('Error fetching rewards config:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update rewards configuration (Master Admin only)
export async function PUT(request) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();
    const { config_key, config_value } = body;

    // Get user ID from request headers (set by middleware/auth)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_master_admin')
      .eq('id', userId)
      .single();

    if (userError || !userData?.is_master_admin) {
      return NextResponse.json({ error: 'Forbidden - Master Admin only' }, { status: 403 });
    }

    // Update config
    const { data, error } = await supabase
      .from('rewards_config')
      .update({ 
        config_value,
        updated_at: new Date().toISOString(),
        updated_by: userId
      })
      .eq('config_key', config_key)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      config: data,
      message: 'Reward configuration updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating rewards config:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
