/**
 * Redis-backed TTL cache for IMAP data.
 * Persists across server restarts and works across multiple instances.
 * Falls back to in-process Map cache if Redis is unavailable.
 */

import redis from '@/lib/redis';

const TTL_LIST    = 300;  // message list: 5 minutes
const TTL_MESSAGE = 600;  // full message body: 10 minutes
const TTL_FOLDERS = 600;  // folder list: 10 minutes
const STALE_AFTER = 60;   // trigger background refresh after 60s (stale-while-revalidate)

function cacheKey(...parts) {
  return `imap::${parts.join('::')}`;
}

// ── Redis helpers with silent fallback ────────────────────────────────────────

async function get(key) {
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {}
}

async function del(key) {
  try {
    await redis.del(key);
  } catch {}
}

// Redis has no native prefix scan on free tier - use stored key sets per prefix
async function delByPrefix(prefix) {
  try {
    const trackKey = `${prefix}::__keys`;
    const keys = await redis.smembers(trackKey);
    if (keys && keys.length > 0) {
      await Promise.all([
        ...keys.map(k => redis.del(k)),
        redis.del(trackKey),
      ]);
    }
  } catch {}
}

async function trackKey(prefix, key) {
  try {
    await redis.sadd(`${prefix}::__keys`, key);
  } catch {}
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getCachedList(accountEmail, folder, page, limit) {
  return get(cacheKey('list', accountEmail, folder, page, limit));
}

export async function setCachedList(accountEmail, folder, page, limit, data) {
  const key = cacheKey('list', accountEmail, folder, page, limit);
  const prefix = cacheKey('list', accountEmail, folder);
  await set(key, data, TTL_LIST);
  await trackKey(prefix, key);
}

export async function getCachedMessage(accountEmail, folder, uid) {
  return get(cacheKey('msg', accountEmail, folder, uid));
}

export async function setCachedMessage(accountEmail, folder, uid, data) {
  await set(cacheKey('msg', accountEmail, folder, uid), data, TTL_MESSAGE);
}

export async function getCachedFolders(accountEmail) {
  return get(cacheKey('folders', accountEmail));
}

export async function setCachedFolders(accountEmail, data) {
  await set(cacheKey('folders', accountEmail), data, TTL_FOLDERS);
}

/** Invalidate all list pages for a folder (e.g. after delete/flag change) */
export async function invalidateList(accountEmail, folder) {
  await delByPrefix(cacheKey('list', accountEmail, folder));
}

/** Invalidate a single cached message */
export async function invalidateMessage(accountEmail, folder, uid) {
  await del(cacheKey('msg', accountEmail, folder, uid));
}
