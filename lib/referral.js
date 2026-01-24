/**
 * Referral System Utility Functions
 * Handles referral code generation, validation, and tracking
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Get or create referral code for the current user
 * @returns {Promise<{success: boolean, code?: string, error?: string}>}
 */
export async function getOrCreateReferralCode() {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Call the database function to get or create referral code
    const { data, error } = await supabase.rpc('get_or_create_referral_code', {
      p_user_id: user.id
    });

    if (error) {
      console.error('Error getting referral code:', error);
      return { success: false, error: error.message };
    }

    return { success: true, code: data };
  } catch (error) {
    console.error('Exception in getOrCreateReferralCode:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Validate if a referral code exists and is active
 * @param {string} code - The referral code to validate
 * @returns {Promise<{valid: boolean, referrerId?: string, error?: string}>}
 */
export async function validateReferralCode(code) {
  try {
    const supabase = createClient();

    // Query referral_codes table
    const { data, error } = await supabase
      .from('referral_codes')
      .select('user_id, is_active')
      .eq('referral_code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { valid: false, error: 'Invalid referral code' };
      }
      return { valid: false, error: error.message };
    }

    return { valid: true, referrerId: data.user_id };
  } catch (error) {
    console.error('Exception in validateReferralCode:', error);
    return { valid: false, error: error.message };
  }
}

/**
 * Track a referral when a new user signs up with a referral code
 * @param {string} referralCode - The referral code used
 * @param {string} newUserId - The ID of the newly registered user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function trackReferral(referralCode, newUserId) {
  try {
    const supabase = createClient();

    // Validate the referral code first
    const validation = await validateReferralCode(referralCode);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check if user has already been referred
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', newUserId)
      .single();

    if (existingReferral) {
      return { success: false, error: 'User has already been referred' };
    }

    // Create referral record
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: validation.referrerId,
        referred_id: newUserId,
        referral_code: referralCode.toUpperCase(),
        status: 'pending',
        reward_points: 0
      });

    if (insertError) {
      console.error('Error tracking referral:', insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception in trackReferral:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Complete a referral and award rewards
 * @param {string} referredUserId - The ID of the referred user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function completeReferral(referredUserId) {
  try {
    const supabase = createClient();

    // Get the referral record
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('id, referrer_id, referred_id, status')
      .eq('referred_id', referredUserId)
      .eq('status', 'pending')
      .single();

    if (fetchError || !referral) {
      return { success: false, error: 'Referral not found or already completed' };
    }

    // Update referral status to completed
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', referral.id);

    if (updateError) {
      console.error('Error completing referral:', updateError);
      return { success: false, error: updateError.message };
    }

    // Award rewards (this will be handled by a separate function)
    await awardReferralRewards(referral.id, referral.referrer_id, referral.referred_id);

    return { success: true };
  } catch (error) {
    console.error('Exception in completeReferral:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Award rewards for a completed referral
 * @param {string} referralId - The referral ID
 * @param {string} referrerId - The referrer user ID
 * @param {string} referredId - The referred user ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function awardReferralRewards(referralId, referrerId, referredId) {
  try {
    const supabase = createClient();

    const REFERRER_REWARD = 100; // DAG Points for referrer
    const REFERRED_REWARD = 50;  // DAG Points for referred user

    // Award points to referrer
    const { error: referrerRewardError } = await supabase
      .from('referral_rewards')
      .insert({
        user_id: referrerId,
        referral_id: referralId,
        reward_type: 'points',
        reward_value: REFERRER_REWARD,
        reward_description: 'Referral bonus for inviting a friend'
      });

    if (referrerRewardError) {
      console.error('Error awarding referrer reward:', referrerRewardError);
    }

    // Award points to referred user
    const { error: referredRewardError } = await supabase
      .from('referral_rewards')
      .insert({
        user_id: referredId,
        referral_id: referralId,
        reward_type: 'points',
        reward_value: REFERRED_REWARD,
        reward_description: 'Welcome bonus for joining via referral'
      });

    if (referredRewardError) {
      console.error('Error awarding referred reward:', referredRewardError);
    }

    // Update referral status to rewarded
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        status: 'rewarded',
        reward_points: REFERRER_REWARD
      })
      .eq('id', referralId);

    if (updateError) {
      console.error('Error updating referral to rewarded:', updateError);
    }

    // Update user DAG points (assuming there's a dag_points column in users table)
    await supabase.rpc('increment_user_points', {
      user_id: referrerId,
      points: REFERRER_REWARD
    }).catch(err => console.error('Error incrementing referrer points:', err));

    await supabase.rpc('increment_user_points', {
      user_id: referredId,
      points: REFERRED_REWARD
    }).catch(err => console.error('Error incrementing referred points:', err));

    return { success: true };
  } catch (error) {
    console.error('Exception in awardReferralRewards:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get referral statistics for the current user
 * @returns {Promise<{success: boolean, stats?: object, error?: string}>}
 */
export async function getReferralStats() {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get stats from referral_stats table
    const { data: stats, error: statsError } = await supabase
      .from('referral_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      console.error('Error fetching referral stats:', statsError);
      return { success: false, error: statsError.message };
    }

    // If no stats exist yet, return default values
    if (!stats) {
      return {
        success: true,
        stats: {
          total_referrals: 0,
          successful_referrals: 0,
          pending_referrals: 0,
          total_points_earned: 0,
          last_referral_at: null
        }
      };
    }

    return { success: true, stats };
  } catch (error) {
    console.error('Exception in getReferralStats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get list of referrals for the current user
 * @returns {Promise<{success: boolean, referrals?: array, error?: string}>}
 */
export async function getUserReferrals() {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get referrals with referred user info
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        id,
        status,
        reward_points,
        created_at,
        completed_at,
        referred:referred_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user referrals:', error);
      return { success: false, error: error.message };
    }

    return { success: true, referrals: referrals || [] };
  } catch (error) {
    console.error('Exception in getUserReferrals:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Copy referral code to clipboard
 * @param {string} code - The referral code to copy
 * @returns {Promise<boolean>}
 */
export async function copyReferralCode(code) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(code);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        console.error('Fallback: Could not copy text', error);
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Generate referral link for sharing
 * @param {string} code - The referral code
 * @returns {string}
 */
export function generateReferralLink(code) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dagarmy.com';
  return `${baseUrl}/register?ref=${code}`;
}
