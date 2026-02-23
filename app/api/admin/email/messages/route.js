import { NextResponse } from 'next/server';
import { getAdminSession, requirePermission } from '@/lib/admin-auth';
import { fetchMessages, searchMessages } from '@/lib/email/imap-client';

/**
 * GET /api/admin/email/messages?folder=INBOX&page=1&limit=25&search=query
 * Returns paginated message list for the current admin's department mailbox.
 * If search param is provided, performs server-side IMAP SEARCH across all messages.
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

  try {
    const result = search
      ? await searchMessages(accountEmail, folder, search, { page, limit })
      : await fetchMessages(accountEmail, folder, { page, limit });
    return NextResponse.json({ ...result, folder, accountEmail });
  } catch (err) {
    console.error('IMAP messages error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: err.message },
      { status: 500 }
    );
  }
}
