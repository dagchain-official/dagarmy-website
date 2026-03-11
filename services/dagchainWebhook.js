/**
 * DAGChain Webhook Sender Service
 *
 * Sends events FROM DAGARMY TO DAGChain platform.
 * Endpoint: POST https://api.dagchain.network/api/v1/dag-army/webhook
 * Auth:     X-DAGARMY-Secret header
 *
 * Events fired:
 *   user.created       — on profile completion (new user signup)
 *   user.updated       — on profile update
 *   referral.completed — when a referral is processed (DAGChain is referral SSO source of truth)
 *
 * Retry strategy: 3 attempts, exponential backoff (30s → 2m → 10m)
 * All calls are fire-and-forget (non-blocking) — never fails the caller.
 */

const WEBHOOK_URL = process.env.DAGCHAIN_WEBHOOK_URL || 'https://api.dagchain.network/api/v1/dag-army/webhook';
// DAGARMY_OUTGOING_SECRET = the secret DAGChain uses to verify events coming FROM DAGARMY
// This is different from DAGCHAIN_WEBHOOK_SECRET (which DAGARMY uses to verify events coming FROM DAGChain)
const WEBHOOK_SECRET = process.env.DAGARMY_OUTGOING_SECRET || process.env.DAGCHAIN_WEBHOOK_SECRET || '';
const TIMEOUT_MS = 30000;
const RETRY_DELAYS = [30_000, 120_000, 600_000]; // 30s, 2m, 10m

function generateIdempotencyKey(event, userId, extra = '') {
  const date = new Date().toISOString().split('T')[0];
  const suffix = extra ? `_${extra}` : '';
  return `dagarmy_${event}_${userId}${suffix}_${date}`;
}

async function sendWithRetry(payload, attempt = 0) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-DAGARMY-Secret': WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (res.ok) {
      console.log(`[DAGChain Webhook] ${payload.event} delivered (attempt ${attempt + 1})`);
      return;
    }

    // 4xx — do not retry, log and bail
    if (res.status >= 400 && res.status < 500) {
      const body = await res.text();
      console.error(`[DAGChain Webhook] ${payload.event} client error ${res.status} — body: ${body}`);
      return;
    }

    // 5xx — fall through to retry
    throw new Error(`HTTP ${res.status}`);

  } catch (err) {
    if (attempt < RETRY_DELAYS.length) {
      const delay = RETRY_DELAYS[attempt];
      console.warn(`[DAGChain Webhook] ${payload.event} failed (${err.message}), retry ${attempt + 1} in ${delay / 1000}s`);
      setTimeout(() => sendWithRetry(payload, attempt + 1), delay);
    } else {
      console.error(`[DAGChain Webhook] ${payload.event} max retries exceeded — giving up`);
    }
  }
}

function dispatch(event, data, idempotencyKey) {
  if (!WEBHOOK_SECRET) {
    console.warn(`[DAGChain Webhook → DAGChain] DAGARMY_OUTGOING_SECRET not set — skipping ${event}`);
    return;
  }

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    userId: String(data.externalUserId || data.referredExternalId || ''),
    email: data.email || undefined,
    data,
  };

  console.log(`[DAGChain Webhook → DAGChain] Dispatching ${event} to ${WEBHOOK_URL} for user=${payload.userId || payload.email}`);

  // Fire-and-forget — never blocks the caller
  sendWithRetry(payload).catch(err => {
    console.error(`[DAGChain Webhook → DAGChain] Unexpected dispatch error for ${event}:`, err.message);
  });
}

/**
 * Fire user.created — call after a new user profile is saved
 * @param {Object} user - { id, email, wallet_address, first_name, last_name, referral_code_used }
 */
export function notifyUserCreated(user) {
  const idempotencyKey = generateIdempotencyKey('user.created', user.id);
  dispatch('user.created', {
    externalUserId: user.id,
    email: user.email || null,
    walletAddress: user.wallet_address || null,
    displayName: user.full_name || [user.first_name, user.last_name].filter(Boolean).join(' ') || null,
    referralCode: user.referral_code_used || null,
  }, idempotencyKey);
}

/**
 * Fire user.updated — call after profile fields are updated
 * @param {Object} user - { id, email, wallet_address, ...updatedFields }
 * @param {Object} updates - only the fields that changed (safe fields only)
 */
export function notifyUserUpdated(user, updates) {
  const idempotencyKey = generateIdempotencyKey('user.updated', user.id, Date.now());
  const safeFields = ['displayName', 'username', 'avatar', 'bio', 'country', 'first_name', 'last_name'];
  const safeUpdates = {};
  for (const field of safeFields) {
    if (updates[field] !== undefined) safeUpdates[field] = updates[field];
  }
  if (Object.keys(safeUpdates).length === 0) return;

  dispatch('user.updated', {
    externalUserId: user.id,
    email: user.email || null,
    ...safeUpdates,
  }, idempotencyKey);
}

/**
 * Fire referral.completed — call after a referral is validated and points awarded.
 * DAGChain is the SSO source of truth for referrals.
 *
 * @param {Object} referrer - { id, email, wallet_address }
 * @param {Object} referred - { id, email, wallet_address }
 * @param {string} referralCode - the code used
 * @param {string} source - 'link' | 'direct' | 'social' | 'qr_code'
 */
export function notifyReferralCompleted(referrer, referred, referralCode, source = 'direct') {
  const idempotencyKey = generateIdempotencyKey('referral.completed', referrer.id, referred.id);
  dispatch('referral.completed', {
    externalUserId: referred.id,
    referredExternalId: referred.id,
    referrerExternalId: referrer.id,
    referrerEmail: referrer.email || null,
    email: referred.email || null,
    referralCode: referralCode || null,
    source,
  }, idempotencyKey);
}
