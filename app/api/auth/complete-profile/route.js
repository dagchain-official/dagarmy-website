import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notifyUserCreated } from '@/services/dagchainWebhook';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/smtp-client';
import { welcomeEmailTemplate } from '@/lib/email-templates';

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

    // Use email or wallet_address as identifier (upsert based on available identifier)
    let data, error;
    
    if (email) {
      // Use upsert with email as the unique identifier
      const full_name = `${first_name.trim()} ${last_name.trim()}`;
      const result = await supabase
        .from('users')
        .upsert({
          email: email,
          wallet_address: wallet_address ? wallet_address.toLowerCase() : null,
          first_name,
          last_name,
          full_name,
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
    } else if (wallet_address) {
      // No email - wallet_address is not unique so we can't use ON CONFLICT.
      // Instead: look up existing user by wallet, then update or insert.
      const normalizedWallet = wallet_address.toLowerCase();

      const { data: existing, error: lookupError } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', normalizedWallet)
        .maybeSingle();

      if (lookupError) {
        data = null;
        error = lookupError;
      } else if (existing) {
        const full_name = `${first_name.trim()} ${last_name.trim()}`;
        const result = await supabase
          .from('users')
          .update({
            first_name,
            last_name,
            full_name,
            country_code: country_code || '+91',
            whatsapp_number,
            profile_completed: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        const full_name = `${first_name.trim()} ${last_name.trim()}`;
        const result = await supabase
          .from('users')
          .insert({
            wallet_address: normalizedWallet,
            email: null,
            first_name,
            last_name,
            full_name,
            country_code: country_code || '+91',
            whatsapp_number,
            profile_completed: true,
            role: 'student',
            tier: 'DAG_SOLDIER',
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        data = result.data;
        error = result.error;
      }
    } else {
      // Neither email nor wallet_address provided
      return NextResponse.json(
        { error: 'Either email or wallet address is required for profile completion' },
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

    // Track referral + award join points to upline (fire-and-forget, non-blocking)
    if (body.referral_code && data?.id) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      // Step 1: Create the referrals row
      fetch(`${baseUrl}/api/referral/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: body.referral_code, userId: data.id }),
      })
        .then(async (trackRes) => {
          const trackData = await trackRes.json();
          if (trackRes.ok && trackData.success) {
            // Step 2: Award join points to upline
            fetch(`${baseUrl}/api/referral/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ referredUserId: data.id }),
            }).catch(err => console.error('⚠️ referral/complete failed (non-blocking):', err));
          } else {
            console.log('ℹ️ Referral track skipped:', trackData.error || 'already tracked');
          }
        })
        .catch(err => console.error('⚠️ referral/track failed (non-blocking):', err));
    }

    // Notify DAGChain of new user (fire-and-forget)
    // Fetch user's own referral code to include in payload
    const { data: ownReferralCode } = await supabaseAdmin.rpc('get_or_create_referral_code', {
      p_user_id: data.id,
    });
    notifyUserCreated({
      id: data.id,
      email: data.email,
      wallet_address: data.wallet_address,
      first_name: data.first_name,
      last_name: data.last_name,
      referral_code_own: ownReferralCode || null,
      referral_code_used: body.referral_code || null,
    });

    // Send welcome email asynchronously (fire-and-forget)
    if (data.email) {
      const fullName = `${data.first_name} ${data.last_name}`.trim();
      sendEmail('support@dagchain.network', {
        to: data.email,
        subject: 'Welcome to DAGARMY - Your Learning Journey Begins!',
        html: welcomeEmailTemplate(fullName || 'there'),
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
