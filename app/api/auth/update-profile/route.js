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
    console.log('📝 Update Profile Request:', body);

    const { 
      wallet_address: current_wallet,
      first_name,
      last_name,
      user_provided_email,
      country_code,
      whatsapp_number,
      bio,
      skill_occupation,
      avatar_url,
      banner_url,
      social_links,
      wallet_address: new_wallet_address
    } = body;

    // Validation - need at least one identifier
    if (!current_wallet && !user_provided_email) {
      return NextResponse.json(
        { error: 'Wallet address or email is required to identify user' },
        { status: 400 }
      );
    }

    // Update user profile
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    // Only update fields that are provided
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (user_provided_email !== undefined) updateData.user_provided_email = user_provided_email;
    if (country_code !== undefined) updateData.country_code = country_code;
    if (whatsapp_number !== undefined) updateData.whatsapp_number = whatsapp_number;
    if (bio !== undefined) updateData.bio = bio;
    if (skill_occupation !== undefined) updateData.skill_occupation = skill_occupation;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (banner_url !== undefined) updateData.banner_url = banner_url;
    if (social_links !== undefined) updateData.social_links = social_links;
    if (new_wallet_address !== undefined) updateData.wallet_address = new_wallet_address;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('wallet_address', current_wallet)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update profile' },
        { status: 500 }
      );
    }

    console.log('✅ Profile updated successfully:', data);

    return NextResponse.json({
      success: true,
      user: data,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('❌ Error in update-profile API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
