import { NextResponse } from 'next/server'

/**
 * GET /api/reown/user-profile?address=0x...
 * Fetch user profile from Reown Auth API
 * This is needed because Reown doesn't expose social login email/name in client SDK
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'ba3751e293e717d7fd71426e6c862e79'

    // Call Reown's Auth API to get user profile
    const response = await fetch(
      `https://rpc.walletconnect.com/v1/identity/${address}?projectId=${projectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.log('Reown API response not OK:', response.status)
      return NextResponse.json(
        { error: 'Failed to fetch user profile from Reown' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Reown user profile data:', data)

    // Extract email and name from response
    const userProfile = {
      email: data.email || data.profile?.email || null,
      name: data.name || data.profile?.name || data.displayName || null,
      avatar: data.avatar || data.profile?.avatar || null,
    }

    return NextResponse.json({
      success: true,
      profile: userProfile,
    })
  } catch (error) {
    console.error('Error fetching Reown user profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
