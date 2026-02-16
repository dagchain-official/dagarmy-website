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
    const { config_key, config_value, user_email } = body;

    // Check if user email is provided
    if (!user_email) {
      return NextResponse.json({ error: 'Unauthorized - Email required' }, { status: 401 });
    }

    // Verify user is master admin via email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, is_master_admin, email')
      .eq('email', user_email)
      .single();

    if (userError || !userData?.is_master_admin) {
      console.error('Authorization failed:', { userError, userData });
      return NextResponse.json({ error: 'Unauthorized - Master Admin access required' }, { status: 403 });
    }

    const userId = userData.id;

    // Upsert config (insert if missing, update if exists)
    const { data, error } = await supabase
      .from('rewards_config')
      .upsert({ 
        config_key,
        config_value,
        updated_at: new Date().toISOString(),
        updated_by: userId
      }, { onConflict: 'config_key' })
      .select();

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
