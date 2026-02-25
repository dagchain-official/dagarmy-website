import { NextResponse } from 'next/server';
import { getAdminSession, requirePermission } from '@/lib/admin-auth';
import { fetchMessages, searchMessages } from '@/lib/email/imap-client';
import { getCachedList, setCachedList } from '@/lib/email/message-cache';
import redis from '@/lib/redis';

const TTL_LIST = 300;   // 5 minutes
const STALE_AFTER = 60; // background refresh if older than 60s

/**
 * GET /api/admin/email/messages?folder=INBOX&page=1&limit=25&search=query&refresh=1
 * Returns paginated message list. Serves from Redis cache instantly (stale-while-revalidate).
 * Pass refresh=1 to force a fresh IMAP fetch.
 */
export async function GET(request) {
  const guard = await requirePermission(request, 'notifications.read');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;

  if (!accountEmail) {
    return NextResponse.json({ error: 'No department email configured for this admin' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder') || 'INBOX';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '25'));
  const search = (searchParams.get('search') || '').trim();
  const forceRefresh = searchParams.get('refresh') === '1';

  // Search bypasses cache (results vary by query)
  if (search) {
    try {
      const result = await searchMessages(accountEmail, folder, search, { page, limit });
      return NextResponse.json({ ...result, folder, accountEmail });
    } catch (err) {
      console.error('IMAP search error:', err);
      return NextResponse.json({ error: 'Failed to search messages', details: err.message }, { status: 500 });
    }
  }

  const cacheKey = `imap::list::${accountEmail}::${folder}::${page}::${limit}`;
  const staleKey = `${cacheKey}::stale_at`;

  try {
    // Serve from cache if available and not forced refresh
    if (!forceRefresh) {
      const cached = await getCachedList(accountEmail, folder, page, limit);
      if (cached) {
        // Check if cache is getting stale — refresh in background without blocking
        const staleAt = await redis.get(staleKey);
        if (!staleAt || Date.now() > parseInt(staleAt)) {
          // Fire-and-forget background refresh
          fetchMessages(accountEmail, folder, { page, limit })
            .then(fresh => setCachedList(accountEmail, folder, page, limit, fresh))
            .catch(() => {});
          // Reset stale timer so background refresh only fires once per interval
          await redis.set(staleKey, Date.now() + STALE_AFTER * 1000, { ex: TTL_LIST });
        }
        return NextResponse.json({ ...cached, folder, accountEmail, fromCache: true });
      }
    }

    // Cache miss or forced refresh — fetch live from IMAP
    const result = await fetchMessages(accountEmail, folder, { page, limit });
    await redis.set(staleKey, Date.now() + STALE_AFTER * 1000, { ex: TTL_LIST });
    return NextResponse.json({ ...result, folder, accountEmail });
  } catch (err) {
    console.error('IMAP messages error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: err.message },
      { status: 500 }
    );
  }
}
