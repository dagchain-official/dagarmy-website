import { NextResponse } from 'next/server';
import { getAdminSession, requirePermission } from '@/lib/admin-auth';
import { fetchStarredMessages } from '@/lib/email/imap-client';

/**
 * GET /api/admin/email/starred?page=1&limit=25
 * Returns all starred (flagged) messages from INBOX.
 */
export async function GET(request) {
  const guard = await requirePermission(request, 'notifications.read');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;
  if (!accountEmail) return NextResponse.json({ error: 'No department email configured' }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '25'));

  try {
    const result = await fetchStarredMessages(accountEmail, 'INBOX', { page, limit });
    return NextResponse.json({ ...result, accountEmail });
  } catch (err) {
    console.error('IMAP starred error:', err);
    return NextResponse.json({ error: 'Failed to fetch starred messages', details: err.message }, { status: 500 });
  }
}
