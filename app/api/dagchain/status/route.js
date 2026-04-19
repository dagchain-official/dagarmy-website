import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/dagchain/status?email=...
 * Returns cached DAGChain data for a user from Supabase.
 * No live DAGChain API call - reads stored dagchain_data.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'email or userId parameter required' },
        { status: 400 }
      )
    }

    const query = supabaseAdmin
      .from('users')
      .select(`
        id,
        email,
        full_name,
        dagchain_user_id,
        dagchain_wallet_address,
        dagchain_auth_provider,
        dagchain_referral_code,
        dagchain_referred_by,
        dagchain_joined_at,
        dagchain_synced_at,
        dagchain_data
      `)

    const { data: user, error } = email
      ? await query.eq('email', email).maybeSingle()
      : await query.eq('id', userId).maybeSingle()

    if (error) throw error

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isLinked = !!user.dagchain_user_id

    // Fetch node counts from dagchain_nodes table
    const { data: nodes } = await supabaseAdmin
      .from('dagchain_nodes')
      .select('node_type, status, tier, amount_usd, purchased_at')
      .eq('dagchain_user_id', user.dagchain_user_id || '')

    // Fetch referral count from dagchain_referrals table
    const { count: referralCount } = await supabaseAdmin
      .from('dagchain_referrals')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_dagchain_id', user.dagchain_user_id || '')

    const validatorNodes = nodes?.filter(n => n.node_type === 'validator') || []
    const storageNodes = nodes?.filter(n => n.node_type === 'storage') || []

    return NextResponse.json({
      success: true,
      linked: isLinked,
      dagchain: {
        userId: user.dagchain_user_id,
        walletAddress: user.dagchain_wallet_address,
        authProvider: user.dagchain_auth_provider,
        referralCode: user.dagchain_referral_code,
        referredBy: user.dagchain_referred_by,
        joinedAt: user.dagchain_joined_at,
        syncedAt: user.dagchain_synced_at,
        dagArmy: user.dagchain_data?.dag_army || null,
        points: user.dagchain_data?.dag_army?.points || user.dagchain_data?.points || 0,
        referralStats: user.dagchain_data?.referral_stats || null,
        referralCount: referralCount || 0,
        rewards: user.dagchain_data?.rewards || null,
        nodes: {
          validator: validatorNodes,
          validatorCount: validatorNodes.length,
          storage: storageNodes,
          storageCount: storageNodes.length,
          total: (validatorNodes.length + storageNodes.length),
        },
        payments: user.dagchain_data?.payments || [],
        raw: user.dagchain_data || null,
      },
    })
  } catch (error) {
    console.error('DAGChain status API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch DAGChain status' },
      { status: 500 }
    )
  }
}
