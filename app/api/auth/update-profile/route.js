import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notifyUserUpdated } from '@/services/dagchainWebhook';

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
    // user_provided_email maps to the 'email' column (no such column as user_provided_email)
    if (user_provided_email !== undefined) updateData.email = user_provided_email;
    if (country_code !== undefined) updateData.country_code = country_code;
    if (whatsapp_number !== undefined) updateData.whatsapp_number = whatsapp_number;
    if (bio !== undefined) updateData.bio = bio;
    if (skill_occupation !== undefined) updateData.skill_occupation = skill_occupation;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (banner_url !== undefined) updateData.banner_url = banner_url;
    if (social_links !== undefined) updateData.social_links = social_links;

    // Identify the user: prefer email (email-auth users have no wallet), fall back to wallet
    let query = supabase.from('users').update(updateData).select().single();
    if (user_provided_email) {
      query = supabase.from('users').update(updateData).eq('email', user_provided_email).select().single();
    } else {
      query = supabase.from('users').update(updateData).eq('wallet_address', current_wallet).select().single();
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update profile' },
        { status: 500 }
      );
    }

    console.log('✅ Profile updated successfully:', data);

    // Notify DAGChain of profile update (fire-and-forget)
    notifyUserUpdated(
      { id: data.id, email: data.email },
      {
        first_name,
        last_name,
        displayName: [first_name, last_name].filter(Boolean).join(' ') || undefined,
        bio,
        avatar_url,
        country_code,
      }
    );

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
