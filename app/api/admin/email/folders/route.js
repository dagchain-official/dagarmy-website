import { NextResponse } from 'next/server';
import { getAdminSession, requirePermission } from '@/lib/admin-auth';
import { getMailboxFolders, createMailboxFolder } from '@/lib/email/imap-client';

/**
 * GET /api/admin/email/folders
 * Returns all IMAP folders for the current admin's department email.
 */
export async function GET(request) {
  const guard = await requirePermission(request, 'notifications.read');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;

  if (!accountEmail) {
    return NextResponse.json({ error: 'No department email configured for this admin' }, { status: 400 });
  }

  try {
    const folders = await getMailboxFolders(accountEmail);

    // Sort: common folders first
    const ORDER = ['INBOX', 'Sent', 'Drafts', 'Junk', 'Trash', 'Spam'];
    folders.sort((a, b) => {
      const ai = ORDER.findIndex(o => a.path.toUpperCase().includes(o.toUpperCase()));
      const bi = ORDER.findIndex(o => b.path.toUpperCase().includes(o.toUpperCase()));
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    return NextResponse.json({ folders, accountEmail });
  } catch (err) {
    console.error('IMAP folders error:', err);
    return NextResponse.json(
      { error: 'Failed to connect to mailbox', details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/email/folders
 * Body: { name: string }
 * Creates a new IMAP mailbox folder.
 */
export async function POST(request) {
  const guard = await requirePermission(request, 'notifications.write');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;
  if (!accountEmail) return NextResponse.json({ error: 'No department email configured' }, { status: 400 });

  const { name } = await request.json();
  if (!name?.trim()) return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });

  try {
    const result = await createMailboxFolder(accountEmail, name.trim());
    return NextResponse.json({ success: true, path: result.path });
  } catch (err) {
    console.error('IMAP create folder error:', err);
    return NextResponse.json({ error: 'Failed to create folder', details: err.message }, { status: 500 });
  }
}
