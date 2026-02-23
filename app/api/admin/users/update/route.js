import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '@/lib/admin-auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PUT(request) {
  const guard = await requirePermission(request, 'users.write');
  if (guard) return guard;
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const {
      id,
      full_name,
      first_name,
      last_name,
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
    const { error } = await supabase
      .from('users')
      .update({
        full_name,
        first_name,
        last_name,
        wallet_address,
        role,
        country_code,
        whatsapp_number,
        bio,
        skill_occupation,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
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
