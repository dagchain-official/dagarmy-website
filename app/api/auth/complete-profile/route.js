import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📝 Complete Profile Request:', body);

    const { 
      wallet_address, 
      first_name, 
      last_name, 
      country_code,
      whatsapp_number 
    } = body;

    // Validation
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Remove any non-digit characters for validation
    const digitsOnly = whatsapp_number ? whatsapp_number.replace(/\D/g, '') : '';
    if (!whatsapp_number || digitsOnly.length < 7 || digitsOnly.length > 15) {
      return NextResponse.json(
        { error: 'Valid WhatsApp number is required (7-15 digits)' },
        { status: 400 }
      );
    }

    // Use upsert to handle both create and update cases
    const userData = {
      wallet_address: wallet_address || null,
      first_name,
      last_name,
      country_code: country_code || '+91',
      whatsapp_number,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    };

    // Find existing user and update, or create if not found
    let data, error;
    
    if (wallet_address) {
      // Find user by wallet address
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', wallet_address)
        .maybeSingle();

      if (existing) {
        // Update existing user
        const result = await supabase
          .from('users')
          .update(userData)
          .eq('id', existing.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Create new user record
        console.log('🆕 Creating new user record for wallet:', wallet_address);
        const result = await supabase
          .from('users')
          .insert({
            ...userData,
            role: 'student',
            tier: 'DAG_SOLDIER',
            dag_points: 0, // Will be set by trigger
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        data = result.data;
        error = result.error;
      }
    }

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to save profile' },
        { status: 500 }
      );
    }

    console.log('✅ Profile completed successfully:', data);

    return NextResponse.json({
      success: true,
      user: data,
      message: 'Profile completed successfully'
    });

  } catch (error) {
    console.error('❌ Error in complete-profile API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
