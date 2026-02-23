/**
 * In-process TTL cache for IMAP data.
 * Survives across Next.js API requests in the same Node.js process.
 * Uses global to persist across hot-reloads in dev.
 */

const TTL_LIST    = 60_000;   // message list: 60 seconds
const TTL_MESSAGE = 300_000;  // full message body: 5 minutes
const TTL_FOLDERS = 120_000;  // folder list: 2 minutes

if (!global.__imapCache) {
  global.__imapCache = new Map();
}
const cache = global.__imapCache;

function cacheKey(...parts) {
  return parts.join('::');
}

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function set(key, value, ttl) {
  cache.set(key, { value, expiresAt: Date.now() + ttl });
}

function del(key) {
  cache.delete(key);
}

function delByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getCachedList(accountEmail, folder, page, limit) {
  return get(cacheKey('list', accountEmail, folder, page, limit));
}

export function setCachedList(accountEmail, folder, page, limit, data) {
  set(cacheKey('list', accountEmail, folder, page, limit), data, TTL_LIST);
}

export function getCachedMessage(accountEmail, folder, uid) {
  return get(cacheKey('msg', accountEmail, folder, uid));
}

export function setCachedMessage(accountEmail, folder, uid, data) {
  set(cacheKey('msg', accountEmail, folder, uid), data, TTL_MESSAGE);
}

export function getCachedFolders(accountEmail) {
  return get(cacheKey('folders', accountEmail));
}

export function setCachedFolders(accountEmail, data) {
  set(cacheKey('folders', accountEmail), data, TTL_FOLDERS);
}

/** Invalidate all list pages for a folder (e.g. after delete/flag change) */
export function invalidateList(accountEmail, folder) {
  delByPrefix(cacheKey('list', accountEmail, folder));
}

/** Invalidate a single cached message */
export function invalidateMessage(accountEmail, folder, uid) {
  del(cacheKey('msg', accountEmail, folder, uid));
}
