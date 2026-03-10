import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

const WEBHOOK_SECRET = process.env.DAGCHAIN_WEBHOOK_SECRET

/**
 * POST /api/dagchain/webhook
 * Receives events pushed from DAGChain platform.
 * DAGChain devs must include header: X-DAGChain-Secret: <secret>
 */
export async function POST(request) {
  try {
    // 1. Verify secret
    const secret = request.headers.get('x-dagchain-secret')
    if (!WEBHOOK_SECRET) {
      console.error('DAGChain webhook: DAGCHAIN_WEBHOOK_SECRET env var is not set')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (secret !== WEBHOOK_SECRET) {
      console.warn(`DAGChain webhook: secret mismatch — received="${secret?.substring(0, 6)}..." expected prefix="${WEBHOOK_SECRET.substring(0, 6)}..."`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { event, timestamp, userId, email, data } = body

    if (!event) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 })
    }

    // 2. Log every event immediately (audit trail)
    await supabaseAdmin.from('dagchain_events').insert({
      event_type: event,
      dagchain_user_id: userId || null,
      email: email || null,
      payload: body,
      processed: false,
    })

    // 3. Route to handler
    let handlerError = null
    try {
      switch (event) {
        case 'user.created':
          await handleUserCreated({ userId, email, timestamp, data })
          break
        case 'user.updated':
          await handleUserUpdated({ userId, email, data })
          break
        case 'referral.completed':
          await handleReferralCompleted({ userId, email, timestamp, data })
          break
        case 'node.purchased':
          await handleNodePurchased({ userId, email, timestamp, data })
          break
        case 'payment.completed':
          await handlePaymentCompleted({ userId, email, timestamp, data })
          break
        case 'reward.issued':
          await handleRewardIssued({ userId, email, data })
          break
        default:
          console.log(`DAGChain webhook: unhandled event type "${event}"`)
      }

      // Mark event as processed
      await supabaseAdmin
        .from('dagchain_events')
        .update({ processed: true })
        .eq('dagchain_user_id', userId || '')
        .eq('event_type', event)
        .order('received_at', { ascending: false })
        .limit(1)
    } catch (err) {
      handlerError = err.message
      console.error(`DAGChain webhook handler error for "${event}":`, err)
      // Update event log with error
      await supabaseAdmin
        .from('dagchain_events')
        .update({ processed: false, error: err.message })
        .eq('dagchain_user_id', userId || '')
        .eq('event_type', event)
        .order('received_at', { ascending: false })
        .limit(1)
    }

    // Always return 200 so DAGChain doesn't retry endlessly
    return NextResponse.json({
      received: true,
      event,
      ...(handlerError ? { warning: 'Event logged but processing had an error' } : {}),
    })
  } catch (error) {
    console.error('DAGChain webhook fatal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// Event Handlers
// ─────────────────────────────────────────────

async function handleUserCreated({ userId, email, timestamp, data = {} }) {
  if (!email && !userId) return

  const {
    walletAddress,
    authProvider,
    referralCode,
    referredBy,
    displayName,
    username,
    avatar,
  } = data

  // Upsert user into DAGARMY users table by email
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id, dagchain_user_id')
    .eq('email', email)
    .maybeSingle()

  const dagchainFields = {
    dagchain_user_id: userId || null,
    dagchain_wallet_address: walletAddress || null,
    dagchain_auth_provider: authProvider || null,
    dagchain_referral_code: referralCode || null,
    dagchain_referred_by: referredBy || null,
    dagchain_joined_at: timestamp || new Date().toISOString(),
    dagchain_synced_at: new Date().toISOString(),
  }

  if (existingUser) {
    // Merge DAGChain fields into existing DAGARMY user
    await supabaseAdmin
      .from('users')
      .update({
        ...dagchainFields,
        full_name: existingUser.full_name || displayName || null,
        avatar_url: existingUser.avatar_url || avatar || null,
        wallet_address: existingUser.wallet_address || walletAddress || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id)
  } else {
    // Create new user record from DAGChain signup
    await supabaseAdmin.from('users').insert({
      email,
      full_name: displayName || username || null,
      avatar_url: avatar || null,
      wallet_address: walletAddress || null,
      role: 'student',
      auth_provider: authProvider || 'dagchain',
      is_admin: false,
      is_master_admin: false,
      last_login: timestamp || new Date().toISOString(),
      ...dagchainFields,
    })
  }
}

async function handleUserUpdated({ userId, email, data = {} }) {
  if (!email && !userId) return

  const { walletAddress, authProvider, displayName, avatar, referralCode } = data

  const lookup = email
    ? supabaseAdmin.from('users').select('id').eq('email', email).maybeSingle()
    : supabaseAdmin.from('users').select('id').eq('dagchain_user_id', userId).maybeSingle()

  const { data: user } = await lookup
  if (!user) return

  const updates = {
    dagchain_synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  if (walletAddress) updates.dagchain_wallet_address = walletAddress
  if (authProvider) updates.dagchain_auth_provider = authProvider
  if (displayName) updates.full_name = displayName
  if (avatar) updates.avatar_url = avatar
  if (referralCode) updates.dagchain_referral_code = referralCode
  if (userId) updates.dagchain_user_id = userId

  await supabaseAdmin.from('users').update(updates).eq('id', user.id)
}

async function handleReferralCompleted({ userId, email, timestamp, data = {} }) {
  const {
    referralCode,
    referredEmail,
    referredUserId,
    referrerEmail,
    status,
  } = data

  // Look up referrer in DAGARMY
  const referrerLookup = referrerEmail || email
  const { data: referrer } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq(referrerEmail ? 'email' : 'dagchain_user_id', referrerEmail || userId)
    .maybeSingle()

  // Look up referred user in DAGARMY (may or may not exist yet)
  const { data: referred } = referredEmail
    ? await supabaseAdmin.from('users').select('id').eq('email', referredEmail).maybeSingle()
    : { data: null }

  // Insert referral record
  await supabaseAdmin.from('dagchain_referrals').insert({
    referrer_user_id: referrer?.id || null,
    referrer_dagchain_id: userId || null,
    referrer_email: referrerEmail || email || null,
    referred_user_id: referred?.id || null,
    referred_dagchain_id: referredUserId || null,
    referred_email: referredEmail || null,
    referral_code: referralCode || null,
    status: status || 'active',
    joined_at: timestamp || new Date().toISOString(),
    raw_data: data,
  })

  // Update referrer's dagchain_data with latest referral count (increment)
  if (referrer) {
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('dagchain_data')
      .eq('id', referrer.id)
      .single()

    const existing = existingUser?.dagchain_data || {}
    const currentCount = existing.referral_count || 0

    await supabaseAdmin
      .from('users')
      .update({
        dagchain_data: {
          ...existing,
          referral_count: currentCount + 1,
          last_referral_at: timestamp || new Date().toISOString(),
        },
        dagchain_synced_at: new Date().toISOString(),
      })
      .eq('id', referrer.id)
  }
}

async function handleNodePurchased({ userId, email, timestamp, data = {} }) {
  const {
    nodeType,
    nodeId,
    tier,
    amountUsd,
    currency,
    status,
  } = data

  // Find the DAGARMY user
  const { data: user } = email
    ? await supabaseAdmin.from('users').select('id').eq('email', email).maybeSingle()
    : await supabaseAdmin.from('users').select('id').eq('dagchain_user_id', userId).maybeSingle()

  // Insert node purchase record
  await supabaseAdmin.from('dagchain_nodes').insert({
    user_id: user?.id || null,
    dagchain_user_id: userId || null,
    email: email || null,
    node_type: nodeType === 'validator' ? 'validator' : 'storage',
    node_id: nodeId || null,
    tier: tier || null,
    amount_usd: amountUsd || null,
    currency: currency || null,
    status: status || 'active',
    purchased_at: timestamp || new Date().toISOString(),
    raw_data: data,
  })

  // Update user's dagchain_data with node summary
  if (user) {
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('dagchain_data')
      .eq('id', user.id)
      .single()

    const existing = existingUser?.dagchain_data || {}
    const nodes = existing.nodes || { validator: 0, storage: 0 }
    const type = nodeType === 'validator' ? 'validator' : 'storage'
    nodes[type] = (nodes[type] || 0) + 1

    await supabaseAdmin
      .from('users')
      .update({
        dagchain_data: { ...existing, nodes, last_node_purchase_at: timestamp || new Date().toISOString() },
        dagchain_synced_at: new Date().toISOString(),
      })
      .eq('id', user.id)
  }
}

async function handlePaymentCompleted({ userId, email, timestamp, data = {} }) {
  // Find user
  const { data: user } = email
    ? await supabaseAdmin.from('users').select('id, dagchain_data').eq('email', email).maybeSingle()
    : await supabaseAdmin.from('users').select('id, dagchain_data').eq('dagchain_user_id', userId).maybeSingle()

  if (!user) return

  const existing = user.dagchain_data || {}
  const payments = existing.payments || []
  payments.unshift({
    amount: data.amount,
    currency: data.currency,
    productType: data.productType,
    status: data.status,
    at: timestamp || new Date().toISOString(),
  })
  // Keep last 50 payments in JSONB
  const trimmed = payments.slice(0, 50)

  await supabaseAdmin
    .from('users')
    .update({
      dagchain_data: { ...existing, payments: trimmed },
      dagchain_synced_at: new Date().toISOString(),
    })
    .eq('id', user.id)
}

async function handleRewardIssued({ userId, email, data = {} }) {
  const { data: user } = email
    ? await supabaseAdmin.from('users').select('id, dagchain_data').eq('email', email).maybeSingle()
    : await supabaseAdmin.from('users').select('id, dagchain_data').eq('dagchain_user_id', userId).maybeSingle()

  if (!user) return

  const existing = user.dagchain_data || {}
  const currentPoints = existing.points || 0
  const addedPoints = data.points || data.amount || 0

  await supabaseAdmin
    .from('users')
    .update({
      dagchain_data: {
        ...existing,
        points: currentPoints + addedPoints,
        last_reward_at: new Date().toISOString(),
      },
      dagchain_synced_at: new Date().toISOString(),
    })
    .eq('id', user.id)
}
