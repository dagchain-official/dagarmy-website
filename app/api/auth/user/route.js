import { NextResponse } from 'next/server'
import { createOrUpdateUser, getUserByWallet, getUserByEmail } from '@/lib/supabase/api/users'

/**
 * POST /api/auth/user
 * Create or update user profile after wallet/social authentication
 */
export async function POST(request) {
  console.log('🔵 API /api/auth/user POST called')
  
  try {
    const body = await request.json()
    console.log('📦 Request body:', body)
    
    const { wallet_address, email, role, full_name, avatar_url } = body

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
    })

    console.log('✅ User created/updated successfully:', result.user.id)

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
