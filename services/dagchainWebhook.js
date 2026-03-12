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

const WEBHOOK_URL = process.env.DAGCHAIN_WEBHOOK_URL || 'https://nhs-repeated-nov-plates.trycloudflare.com/api/v1/dag-army/webhook';
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

/**
 * dispatch — builds the top-level envelope and sends.
 * @param {string} event
 * @param {string} userId   - DAGARMY user ID (referred user for referral events)
 * @param {string|null} email - top-level email (referred user for referral events)
 * @param {Object} data     - clean event-specific data object (no internal keys)
 */
function dispatch(event, userId, email, data) {
  if (!WEBHOOK_SECRET) {
    console.warn(`[DAGChain Webhook → DAGChain] DAGARMY_OUTGOING_SECRET not set — skipping ${event}`);
    return;
  }

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    userId: String(userId || ''),
    email: email || undefined,
    data,
  };

  console.log(`[DAGChain Webhook → DAGChain] Dispatching ${event} to ${WEBHOOK_URL} for user=${payload.userId || payload.email}`);

  // Fire-and-forget — never blocks the caller
  sendWithRetry(payload).catch(err => {
    console.error(`[DAGChain Webhook → DAGChain] Unexpected dispatch error for ${event}:`, err.message);
  });
}

/**
 * Fire user.created — call after a new user profile is saved.
 * @param {Object} user - { id, email, wallet_address, full_name, first_name, last_name,
 *                          auth_provider, role, referral_code_used, referral_code_referred_by }
 */
export function notifyUserCreated(user) {
  const displayName = user.full_name
    || [user.first_name, user.last_name].filter(Boolean).join(' ')
    || null;

  // Clean data object — only fields DAGChain accepts
  const data = {};
  if (user.wallet_address)          data.walletAddress    = user.wallet_address;
  if (displayName)                  data.displayName      = displayName;
  if (user.first_name)              data.firstName        = user.first_name;
  if (user.last_name)               data.lastName         = user.last_name;
  // referralCode = the user's OWN code (what they share with others)
  if (user.referral_code_own)       data.referralCode     = user.referral_code_own;
  // referredByCode = the code this user was referred WITH (someone else's code they used)
  if (user.referral_code_used)      data.referredByCode   = user.referral_code_used;

  dispatch('user.created', user.id, user.email || null, data);
}

/**
 * Fire user.updated — call after profile fields are updated.
 * Only safe fields accepted by DAGChain are forwarded.
 * @param {Object} user    - { id, email }
 * @param {Object} updates - keys can be camelCase or snake_case; normalised here
 */
export function notifyUserUpdated(user, updates) {
  // Map from DAGARMY snake_case to DAGChain camelCase
  const fieldMapping = {
    displayName: 'displayName',
    display_name: 'displayName',
    username: 'username',
    avatar: 'avatar',
    avatar_url: 'avatar',
    bio: 'bio',
    country: 'country',
    country_code: 'country',
    first_name: 'firstName',
    firstName: 'firstName',
    last_name: 'lastName',
    lastName: 'lastName',
    phone: 'phone',
    phone_country_code: 'phoneCountryCode',
    phoneCountryCode: 'phoneCountryCode',
  };

  const safeUpdates = {};
  for (const [srcField, destField] of Object.entries(fieldMapping)) {
    if (updates[srcField] !== undefined) safeUpdates[destField] = updates[srcField];
  }
  if (Object.keys(safeUpdates).length === 0) return;

  dispatch('user.updated', user.id, user.email || null, safeUpdates);
}

/**
 * Fire referral.completed — call after a referral is validated and points awarded.
 * Top-level userId/email = the REFERRED (new) user.
 * @param {Object} referrer     - { id, email }
 * @param {Object} referred     - { id, email }
 * @param {string} referralCode - the code used
 * @param {string} source       - 'link' | 'direct' | 'social' | 'qr_code' | 'webhook'
 */
export function notifyReferralCompleted(referrer, referred, referralCode, source = 'webhook') {
  const data = {
    referrerExternalId: referrer.id   || null,
    referrerEmail:      referrer.email || null,
    referralCode:       referralCode   || null,
    source,
  };

  dispatch('referral.completed', referred.id, referred.email || null, data);
}
