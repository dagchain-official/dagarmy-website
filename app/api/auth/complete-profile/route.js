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
      email,
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
      wallet_address: wallet_address ? wallet_address.toLowerCase() : null,
      email: email || null,
      first_name,
      last_name,
      country_code: country_code || '+91',
      whatsapp_number,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    };

    // Use email as primary identifier (upsert based on email)
    let data, error;
    
    if (email) {
      // Use upsert with email as the unique identifier
      const result = await supabase
        .from('users')
        .upsert({
          email: email,
          wallet_address: wallet_address ? wallet_address.toLowerCase() : null,
          first_name,
          last_name,
          country_code: country_code || '+91',
          whatsapp_number,
          profile_completed: true,
          role: 'student',
          tier: 'DAG_SOLDIER',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // No email provided - this shouldn't happen with social login
      return NextResponse.json(
        { error: 'Email is required for profile completion' },
        { status: 400 }
      );
    }

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to save profile' },
        { status: 500 }
      );
    }

    console.log('✅ Profile completed successfully:', data);

    // Send welcome email asynchronously (don't wait for it)
    if (data.email) {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/emails/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          name: `${data.first_name} ${data.last_name}`
        })
      }).catch(err => {
        console.error('⚠️ Failed to send welcome email (non-blocking):', err);
      });
    }

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
