import { supabaseAdmin } from '@/lib/supabase/server'

const DAGCHAIN_API_BASE = process.env.DAGCHAIN_API_BASE || 'https://api.dagchain.network/api/v1'

/**
 * Login user on DAGChain using their Reown social token.
 * Returns DAGChain accessToken or null on failure.
 */
async function getDagchainToken({ accessToken, provider, email, name, avatar }) {
  try {
    const res = await fetch(`${DAGCHAIN_API_BASE}/user/socialLogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: provider || 'email',
        accessToken,
        userData: {
          email,
          name: name || undefined,
          picture: avatar || undefined,
        },
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.warn('DAGChain socialLogin failed:', res.status, text)
      return null
    }

    const json = await res.json()
    return {
      accessToken: json.accessToken || json.token || json.data?.accessToken || null,
      refreshToken: json.refreshToken || json.data?.refreshToken || null,
      dagchainUserId: json.userId || json.data?.userId || json.data?.id || null,
    }
  } catch (err) {
    console.warn('DAGChain socialLogin error:', err.message)
    return null
  }
}

/**
 * Fetch all DAGChain data for a user in parallel.
 * Returns merged dagchain_data object.
 */
async function fetchDagchainData(token) {
  const headers = { token, 'Content-Type': 'application/json' }

  const safeGet = async (path) => {
    try {
      const res = await fetch(`${DAGCHAIN_API_BASE}${path}`, { headers })
      if (!res.ok) return null
      const json = await res.json()
      return json?.data || json || null
    } catch {
      return null
    }
  }

  const [
    profile,
    dagArmyStatus,
    pointsHistory,
    referralCode,
    referralStats,
    myReferrals,
    referralTree,
    validatorNodes,
    storageNodes,
    paymentHistory,
    rewardsSummary,
    rewardsPending,
  ] = await Promise.all([
    safeGet('/user/getProfile'),
    safeGet('/dag-army/my-status'),
    safeGet('/dag-army/points-history?limit=50'),
    safeGet('/referral/my-code'),
    safeGet('/referral/stats'),
    safeGet('/referral/my-referrals?limit=100'),
    safeGet('/referral/tree?depth=5'),
    safeGet('/node/validator/my-nodes'),
    safeGet('/node/storage/my-nodes'),
    safeGet('/payment/history?limit=50'),
    safeGet('/rewards/summary'),
    safeGet('/rewards/my-pending'),
  ])

  return {
    profile,
    dag_army: dagArmyStatus,
    points_history: pointsHistory,
    referral_code: referralCode?.code || referralCode,
    referral_stats: referralStats,
    referrals: myReferrals,
    referral_tree: referralTree,
    nodes: {
      validator: validatorNodes,
      storage: storageNodes,
    },
    payments: paymentHistory,
    rewards: {
      summary: rewardsSummary,
      pending: rewardsPending,
    },
    synced_at: new Date().toISOString(),
  }
}

/**
 * Main export - sync a DAGARMY user's DAGChain data.
 * Called after DAGARMY login. Runs silently - never throws.
 *
 * @param {string} email
 * @param {string} reownAccessToken  - from embeddedWalletInfo
 * @param {string} authProvider      - 'google' | 'discord' | 'email' | etc.
 * @param {string|null} name
 * @param {string|null} avatar
 */
export async function syncDagchainUser({ email, reownAccessToken, authProvider, name, avatar }) {
  if (!email || !reownAccessToken) return

  try {
    // 1. Get fresh DAGChain token
    const tokenData = await getDagchainToken({
      accessToken: reownAccessToken,
      provider: authProvider || 'email',
      email,
      name,
      avatar,
    })

    if (!tokenData?.accessToken) {
      console.warn('DAGChain sync: could not obtain token for', email)
      return
    }

    // 2. Fetch all DAGChain data in parallel
    const dagchainData = await fetchDagchainData(tokenData.accessToken)

    // 3. Extract top-level fields for indexed columns
    const referralCode =
      dagchainData.referral_code?.code ||
      dagchainData.referral_code ||
      null

    const walletAddress =
      dagchainData.profile?.walletAddress ||
      dagchainData.profile?.wallet_address ||
      null

    const dagchainUserId =
      tokenData.dagchainUserId ||
      dagchainData.profile?.id ||
      dagchainData.profile?.userId ||
      null

    // 4. Persist to Supabase
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      await supabaseAdmin
        .from('users')
        .update({
          dagchain_user_id: dagchainUserId,
          dagchain_wallet_address: walletAddress || undefined,
          dagchain_referral_code: referralCode || undefined,
          dagchain_token: tokenData.accessToken,
          dagchain_synced_at: new Date().toISOString(),
          dagchain_data: dagchainData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
    }

    // 5. Sync node records into dagchain_nodes table
    await syncNodes({ userId: existingUser?.id, dagchainUserId, email, dagchainData })

    // 6. Sync referrals into dagchain_referrals table
    await syncReferrals({ userId: existingUser?.id, dagchainUserId, email, dagchainData })

    console.log('DAGChain sync complete for', email)
  } catch (err) {
    console.warn('DAGChain sync error (non-fatal):', err.message)
  }
}

async function syncNodes({ userId, dagchainUserId, email, dagchainData }) {
  try {
    const validatorNodes = dagchainData.nodes?.validator?.nodes || dagchainData.nodes?.validator || []
    const storageNodes = dagchainData.nodes?.storage?.nodes || dagchainData.nodes?.storage || []

    const allNodes = [
      ...([].concat(validatorNodes)).map(n => ({ ...n, _type: 'validator' })),
      ...([].concat(storageNodes)).map(n => ({ ...n, _type: 'storage' })),
    ].filter(Boolean)

    for (const node of allNodes) {
      const nodeId = node.nodeId || node.id || node._id
      if (!nodeId) continue

      // Upsert by node_id + dagchain_user_id
      const { data: existing } = await supabaseAdmin
        .from('dagchain_nodes')
        .select('id')
        .eq('node_id', nodeId)
        .eq('dagchain_user_id', dagchainUserId || '')
        .maybeSingle()

      if (!existing) {
        await supabaseAdmin.from('dagchain_nodes').insert({
          user_id: userId || null,
          dagchain_user_id: dagchainUserId || null,
          email: email || null,
          node_type: node._type,
          node_id: nodeId,
          tier: node.tier || node.package || null,
          amount_usd: node.amountUsd || node.amount || null,
          currency: node.currency || null,
          status: node.status || 'active',
          purchased_at: node.purchasedAt || node.createdAt || null,
          raw_data: node,
        })
      }
    }
  } catch (err) {
    console.warn('DAGChain syncNodes error:', err.message)
  }
}

async function syncReferrals({ userId, dagchainUserId, email, dagchainData }) {
  try {
    const referrals = dagchainData.referrals?.referrals ||
      dagchainData.referrals?.data ||
      dagchainData.referrals || []

    for (const ref of [].concat(referrals).filter(Boolean)) {
      const referredId = ref.userId || ref.referredUserId || ref.id
      if (!referredId) continue

      // Skip if already recorded
      const { data: existing } = await supabaseAdmin
        .from('dagchain_referrals')
        .select('id')
        .eq('referrer_dagchain_id', dagchainUserId || '')
        .eq('referred_dagchain_id', referredId)
        .maybeSingle()

      if (!existing) {
        // Try to find referred user in DAGARMY
        const { data: referredUser } = ref.email
          ? await supabaseAdmin.from('users').select('id').eq('email', ref.email).maybeSingle()
          : { data: null }

        await supabaseAdmin.from('dagchain_referrals').insert({
          referrer_user_id: userId || null,
          referrer_dagchain_id: dagchainUserId || null,
          referrer_email: email || null,
          referred_user_id: referredUser?.id || null,
          referred_dagchain_id: referredId,
          referred_email: ref.email || null,
          referral_code: dagchainData.referral_code || null,
          status: ref.status || 'active',
          joined_at: ref.joinedAt || ref.createdAt || null,
          raw_data: ref,
        })
      }
    }
  } catch (err) {
    console.warn('DAGChain syncReferrals error:', err.message)
  }
}
