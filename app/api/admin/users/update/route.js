import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PUT(request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const {
      id,
      full_name,
      first_name,
      last_name,
      user_provided_email,
      wallet_address,
      role,
      country_code,
      whatsapp_number,
      bio,
      skill_occupation,
      is_active
    } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user in database
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name,
        first_name,
        last_name,
        user_provided_email,
        wallet_address,
        role,
        country_code,
        whatsapp_number,
        bio,
        skill_occupation,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error in user update API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
