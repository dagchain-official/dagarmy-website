import { NextResponse } from 'next/server'
import { createOrUpdateUser, getUserByWallet, getUserByEmail } from '@/lib/supabase/api/users'
import { syncDagchainUser } from '@/lib/dagchain/sync'
import { notifyUserCreated } from '@/services/dagchainWebhook'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * POST /api/auth/user
 * Create or update user profile after wallet/social authentication
 */
export async function POST(request) {
  console.log('🔵 API /api/auth/user POST called')
  
  try {
    const body = await request.json()
    console.log('📦 Request body:', body)
    
    const { wallet_address, email, role, full_name, avatar_url, reown_access_token, auth_provider } = body

    // Validate required fields
    if (!wallet_address && !email) {
      // Validation failed: Missing required fields
      return NextResponse.json(
        { error: 'Either wallet_address or email is required' },
        { status: 400 }
      )
    }

    if (!role) {
      console.log('❌ Validation failed: Missing role')
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed, calling createOrUpdateUser...')
    
    // Create or update user
    const result = await createOrUpdateUser({
      wallet_address,
      email,
      role,
      full_name,
      avatar_url,
      auth_provider,
    })

    console.log('✅ User created/updated successfully:', result.user.id)

    // Notify DAGChain of new user (fire-and-forget)
    // Fire for: (a) brand-new users, OR (b) existing users who were never synced to DAGChain yet
    const neverSynced = !result.user.dagchain_synced_at;
    if (result.isNewUser || neverSynced) {
      // Stamp dagchain_synced_at immediately to prevent repeated dispatches on every login
      await supabaseAdmin.from('users').update({ dagchain_synced_at: new Date().toISOString() }).eq('id', result.user.id);
      // Fetch the user's own referral code (get or create)
      const { data: ownReferralCode } = await supabaseAdmin.rpc('get_or_create_referral_code', {
        p_user_id: result.user.id,
      });
      notifyUserCreated({
        id: result.user.id,
        email: result.user.email || email,
        wallet_address: result.user.wallet_address || wallet_address,
        full_name: result.user.full_name || full_name,
        first_name: result.user.first_name || null,
        last_name: result.user.last_name || null,
        auth_provider: result.user.auth_provider || auth_provider || null,
        role: result.user.role || role || 'student',
        referral_code_own: ownReferralCode || null,
        referral_code_used: body.referral_code || null,
      })
    }

    // Silently sync DAGChain data - never blocks or fails the auth response
    if (email && reown_access_token) {
      syncDagchainUser({
        email,
        reownAccessToken: reown_access_token,
        authProvider: auth_provider || 'email',
        name: full_name || null,
        avatar: avatar_url || null,
      }).catch(err => console.warn('DAGChain sync (background):', err.message))
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      isNewUser: result.isNewUser,
    })
  } catch (error) {
    console.error('❌ Error in user auth API:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to create/update user' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/user?wallet=0x... or ?email=user@example.com
 * Get user profile by wallet address or email
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')
    const email = searchParams.get('email')

    if (!wallet && !email) {
      return NextResponse.json(
        { error: 'Either wallet or email parameter is required' },
        { status: 400 }
      )
    }

    let user
    if (wallet) {
      user = await getUserByWallet(wallet)
    } else if (email) {
      user = await getUserByEmail(email)
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
