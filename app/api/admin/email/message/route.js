import { NextResponse } from 'next/server';
import { getAdminSession, requirePermission } from '@/lib/admin-auth';
import { fetchMessage, setMessageSeen, setMessageStarred, moveMessage, deleteMessage } from '@/lib/email/imap-client';

/**
 * GET /api/admin/email/message?folder=INBOX&uid=123
 * Fetch a single full message with HTML body. Also marks it as read.
 */
export async function GET(request) {
  const guard = await requirePermission(request, 'notifications.read');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;
  if (!accountEmail) return NextResponse.json({ error: 'No department email configured' }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder') || 'INBOX';
  const uid = parseInt(searchParams.get('uid'));
  if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

  try {
    const message = await fetchMessage(accountEmail, folder, uid);
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });

    // Mark as read asynchronously (don't block response)
    if (!message.isRead) {
      setMessageSeen(accountEmail, folder, uid, true).catch(() => {});
    }

    return NextResponse.json({ message, accountEmail });
  } catch (err) {
    console.error('IMAP fetch message error:', err);
    return NextResponse.json({ error: 'Failed to fetch message', details: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/email/message
 * Update message flags or move to folder.
 * Body: { folder, uid, action: 'read'|'unread'|'star'|'unstar'|'move', targetFolder? }
 */
export async function PATCH(request) {
  const guard = await requirePermission(request, 'notifications.write');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;
  if (!accountEmail) return NextResponse.json({ error: 'No department email configured' }, { status: 400 });

  const { folder, uid, action, targetFolder } = await request.json();
  if (!folder || !uid || !action) return NextResponse.json({ error: 'folder, uid, action required' }, { status: 400 });

  try {
    switch (action) {
      case 'read':    await setMessageSeen(accountEmail, folder, uid, true); break;
      case 'unread':  await setMessageSeen(accountEmail, folder, uid, false); break;
      case 'star':    await setMessageStarred(accountEmail, folder, uid, true); break;
      case 'unstar':  await setMessageStarred(accountEmail, folder, uid, false); break;
      case 'move':
        if (!targetFolder) return NextResponse.json({ error: 'targetFolder required for move' }, { status: 400 });
        await moveMessage(accountEmail, folder, uid, targetFolder);
        break;
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('IMAP patch error:', err);
    return NextResponse.json({ error: 'Failed to update message', details: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/email/message?folder=INBOX&uid=123
 * Marks message as deleted (moves to Trash).
 */
export async function DELETE(request) {
  const guard = await requirePermission(request, 'notifications.write');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;
  if (!accountEmail) return NextResponse.json({ error: 'No department email configured' }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder') || 'INBOX';
  const uid = parseInt(searchParams.get('uid'));
  if (!uid) return NextResponse.json({ error: 'uid is required' }, { status: 400 });

  try {
    // Try to move to Trash first, fall back to delete flag
    const trashFolders = ['Trash', 'INBOX.Trash', 'Deleted Items', 'Deleted Messages'];
    let moved = false;
    for (const trash of trashFolders) {
      try {
        await moveMessage(accountEmail, folder, uid, trash);
        moved = true;
        break;
      } catch { /* try next */ }
    }
    if (!moved) {
      await deleteMessage(accountEmail, folder, uid);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('IMAP delete error:', err);
    return NextResponse.json({ error: 'Failed to delete message', details: err.message }, { status: 500 });
  }
}
