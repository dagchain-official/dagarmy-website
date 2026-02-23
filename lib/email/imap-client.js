import { ImapFlow } from 'imapflow';
import {
  getCachedList, setCachedList,
  getCachedMessage, setCachedMessage,
  getCachedFolders, setCachedFolders,
  invalidateList, invalidateMessage,
} from './message-cache.js';

// Map department email -> env var key prefix
const ACCOUNT_MAP = {
  'admin@dagchain.network':     'EMAIL_ADMIN',
  'support@dagchain.network':   'EMAIL_SUPPORT',
  'hr@dagchain.network':        'EMAIL_HR',
  'careers@dagchain.network':   'EMAIL_CAREERS',
  'marketing@dagchain.network': 'EMAIL_MARKETING',
};

function getCredentials(accountEmail) {
  const key = ACCOUNT_MAP[accountEmail];
  if (!key) throw new Error(`No credentials configured for: ${accountEmail}`);

  const user = process.env[`${key}_USER`];
  const pass = process.env[`${key}_PASS`];

  if (!user || !pass) {
    throw new Error(`Missing env vars ${key}_USER or ${key}_PASS`);
  }

  return { user, pass };
}

function createClient(accountEmail) {
  const { user, pass } = getCredentials(accountEmail);
  const port = parseInt(process.env.IMAP_PORT || '993');
  const secure = port !== 143 && port !== 110;
  return new ImapFlow({
    host: process.env.IMAP_HOST || 'dagchain.network',
    port,
    secure,
    auth: { user, pass },
    logger: false,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    ...(secure ? {
      tls: {
        rejectUnauthorized: false,
        servername: process.env.IMAP_HOST || 'dagchain.network',
      },
    } : {}),
  });
}

/**
 * List all mailbox folders for an account.
 * Returns array of { path, name, delimiter, flags, specialUse, unreadCount? }
 */
export async function getMailboxFolders(accountEmail) {
  const cached = getCachedFolders(accountEmail);
  if (cached) return cached;

  const client = createClient(accountEmail);
  await client.connect();
  try {
    const list = await client.list();
    const folders = [];
    for (const folder of list) {
      folders.push({
        path: folder.path,
        name: folder.name,
        delimiter: folder.delimiter,
        flags: [...(folder.flags || [])],
        specialUse: folder.specialUse || null,
      });
    }
    setCachedFolders(accountEmail, folders);
    return folders;
  } finally {
    await client.logout();
  }
}

/**
 * Fetch paginated message list from a folder.
 * Returns { messages, total, page, limit }
 */
export async function fetchMessages(accountEmail, folder = 'INBOX', { page = 1, limit = 25 } = {}) {
  const cached = getCachedList(accountEmail, folder, page, limit);
  if (cached) return cached;

  const client = createClient(accountEmail);
  await client.connect();
  try {
    const mailbox = await client.mailboxOpen(folder, { readOnly: true });
    const total = mailbox.exists || 0;

    if (total === 0) {
      return { messages: [], total: 0, page, limit };
    }

    // Calculate sequence range (newest first)
    const end = Math.max(1, total - (page - 1) * limit);
    const start = Math.max(1, end - limit + 1);

    const messages = [];
    for await (const msg of client.fetch(`${start}:${end}`, {
      uid: true,
      flags: true,
      envelope: true,
      bodyStructure: true,
      internalDate: true,
      bodyParts: ['TEXT'],
    })) {
      // Extract a short preview from the text body part
      let preview = '';
      try {
        const textPart = msg.bodyParts?.get('TEXT');
        if (textPart) {
          const raw = textPart.toString('utf8').replace(/\r\n/g, ' ').replace(/\n/g, ' ');
          // Strip HTML tags if present
          preview = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
        }
      } catch {}

      const hasAttachments = (msg.bodyStructure?.childNodes || []).some(n => {
        const disp = (n.disposition || '').toLowerCase();
        const t = (n.type || '').toLowerCase();
        return disp === 'attachment' || (!t.startsWith('text/') && !t.startsWith('multipart/') && t !== '');
      });

      messages.push({
        uid: msg.uid,
        seq: msg.seq,
        subject: msg.envelope?.subject || '(no subject)',
        from: msg.envelope?.from?.[0] || null,
        to: msg.envelope?.to || [],
        date: msg.internalDate || msg.envelope?.date || null,
        flags: [...(msg.flags || [])],
        isRead: (msg.flags || new Set()).has('\\Seen'),
        isStarred: (msg.flags || new Set()).has('\\Flagged'),
        preview,
        hasAttachments,
      });
    }

    // Reverse so newest is first
    messages.reverse();

    const result = { messages, total, page, limit };
    setCachedList(accountEmail, folder, page, limit, result);
    return result;
  } finally {
    await client.logout();
  }
}

/**
 * Search messages in a folder by subject or sender (uses IMAP SEARCH).
 * Returns { messages, total, page, limit }
 */
export async function searchMessages(accountEmail, folder = 'INBOX', query = '', { page = 1, limit = 25 } = {}) {
  const client = createClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(folder, { readOnly: true });

    const q = query.trim();
    // Build OR search: subject OR from contains the query
    const criteria = { or: [{ subject: q }, { from: q }] };
    const uids = await client.search(criteria, { uid: true });

    if (!uids || uids.length === 0) {
      return { messages: [], total: 0, page, limit };
    }

    // Sort descending (newest first — UIDs are generally ascending)
    uids.sort((a, b) => b - a);
    const total = uids.length;
    const start = (page - 1) * limit;
    const pageUids = uids.slice(start, start + limit);

    if (pageUids.length === 0) {
      return { messages: [], total, page, limit };
    }

    const messages = [];
    for await (const msg of client.fetch(pageUids, {
      uid: true, flags: true, envelope: true,
      bodyStructure: true, internalDate: true,
      bodyParts: ['TEXT'],
    }, { uid: true })) {
      let preview = '';
      try {
        const textPart = msg.bodyParts?.get('TEXT');
        if (textPart) {
          preview = textPart.toString('utf8').replace(/\r\n/g, ' ').replace(/\n/g, ' ')
            .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
        }
      } catch {}

      const hasAttachments = (msg.bodyStructure?.childNodes || []).some(n => {
        const disp = (n.disposition || '').toLowerCase();
        const t = (n.type || '').toLowerCase();
        return disp === 'attachment' || (!t.startsWith('text/') && !t.startsWith('multipart/') && t !== '');
      });

      messages.push({
        uid: msg.uid, seq: msg.seq,
        subject: msg.envelope?.subject || '(no subject)',
        from: msg.envelope?.from?.[0] || null,
        to: msg.envelope?.to || [],
        date: msg.internalDate || msg.envelope?.date || null,
        flags: [...(msg.flags || [])],
        isRead: (msg.flags || new Set()).has('\\Seen'),
        isStarred: (msg.flags || new Set()).has('\\Flagged'),
        preview, hasAttachments,
      });
    }

    // Re-sort by date descending after fetch
    messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    return { messages, total, page, limit };
  } finally {
    await client.logout();
  }
}

/**
 * Fetch a single full message (with HTML body).
 * Returns { uid, subject, from, to, cc, date, flags, html, text }
 */
export async function fetchMessage(accountEmail, folder = 'INBOX', uid) {
  const cached = getCachedMessage(accountEmail, folder, uid);
  if (cached) return cached;

  const client = createClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(folder, { readOnly: true });

    let result = null;
    for await (const msg of client.fetch({ uid }, {
      uid: true,
      flags: true,
      envelope: true,
      bodyStructure: true,
      source: true,
    }, { uid: true })) {
      const sourceBuf = msg.source instanceof Buffer ? msg.source : Buffer.from(msg.source || '');
      const { html, text, attachments } = parseEmailBody(sourceBuf);

      result = {
        uid: msg.uid,
        subject: msg.envelope?.subject || '(no subject)',
        from: msg.envelope?.from?.[0] || null,
        to: msg.envelope?.to || [],
        cc: msg.envelope?.cc || [],
        date: msg.envelope?.date || null,
        flags: [...(msg.flags || [])],
        isRead: (msg.flags || new Set()).has('\\Seen'),
        html: html || (text ? `<pre style="font-family:inherit;white-space:pre-wrap;word-break:break-word">${escapeHtml(text)}</pre>` : '<p style="color:#94a3b8">No message content</p>'),
        text,
        attachments,
      };
    }

    if (result) setCachedMessage(accountEmail, folder, uid, result);
    return result;
  } finally {
    await client.logout();
  }
}

/**
 * Mark a message as read or unread.
 */
export async function setMessageSeen(accountEmail, folder, uid, seen = true) {
  invalidateList(accountEmail, folder);
  invalidateMessage(accountEmail, folder, uid);
  const client = createClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(folder);
    if (seen) {
      await client.messageFlagsAdd({ uid }, ['\\Seen'], { uid: true });
    } else {
      await client.messageFlagsRemove({ uid }, ['\\Seen'], { uid: true });
    }
  } finally {
    await client.logout();
  }
}

/**
 * Toggle star (flagged) on a message.
 */
export async function setMessageStarred(accountEmail, folder, uid, starred = true) {
  invalidateList(accountEmail, folder);
  const client = createClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(folder);
    if (starred) {
      await client.messageFlagsAdd({ uid }, ['\\Flagged'], { uid: true });
    } else {
      await client.messageFlagsRemove({ uid }, ['\\Flagged'], { uid: true });
    }
  } finally {
    await client.logout();
  }
}

/**
 * Append a raw RFC 2822 message to the Sent folder.
 * Called after SMTP send so the message appears in Sent.
 */
export async function appendToSentFolder(accountEmail, rawMessage) {
  const client = createClient(accountEmail);
  await client.connect();
  try {
    // Try common Sent folder names used by cPanel/Roundcube
    const sentCandidates = ['INBOX.Sent', 'Sent', 'Sent Items', 'Sent Messages'];
    const list = await client.list();
    const folderPaths = list.map(f => f.path);

    let sentFolder = sentCandidates.find(c =>
      folderPaths.some(p => p.toLowerCase() === c.toLowerCase())
    );

    // Fallback: find by \Sent special-use flag
    if (!sentFolder) {
      const sentByFlag = list.find(f => f.specialUse === '\\Sent');
      if (sentByFlag) sentFolder = sentByFlag.path;
    }

    if (!sentFolder) return; // No Sent folder found — skip silently

    await client.append(sentFolder, rawMessage, ['\\Seen']);
  } finally {
    await client.logout();
  }
}

/**
 * Move a message to another folder (e.g. Trash, Junk).
 */
export async function moveMessage(accountEmail, sourceFolder, uid, targetFolder) {
  invalidateList(accountEmail, sourceFolder);
  invalidateList(accountEmail, targetFolder);
  invalidateMessage(accountEmail, sourceFolder, uid);
  const client = createClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(sourceFolder);
    await client.messageMove({ uid }, targetFolder, { uid: true });
  } finally {
    await client.logout();
  }
}

/**
 * Create a new IMAP mailbox folder.
 */
export async function createMailboxFolder(accountEmail, folderName) {
  const client = createClient(accountEmail);
  await client.connect();
  try {
    // cPanel IMAP uses INBOX. prefix for subfolders
    const path = folderName.startsWith('INBOX.') ? folderName : `INBOX.${folderName}`;
    await client.mailboxCreate(path);
    invalidateList(accountEmail, 'folders');
    // Also bust the folders cache
    const { setCachedFolders } = await import('./message-cache.js');
    // clear by setting expired — simplest approach
    if (global.__imapCache) {
      for (const key of global.__imapCache.keys()) {
        if (key.startsWith(`folders::${accountEmail}`)) global.__imapCache.delete(key);
      }
    }
    return { path };
  } finally {
    await client.logout();
  }
}

/**
 * Fetch all starred (\\Flagged) messages across a folder.
 * Returns { messages, total, page, limit }
 */
export async function fetchStarredMessages(accountEmail, folder = 'INBOX', { page = 1, limit = 25 } = {}) {
  const client = createClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(folder, { readOnly: true });
    const uids = await client.search({ flagged: true }, { uid: true });
    if (!uids || uids.length === 0) return { messages: [], total: 0, page, limit };

    uids.sort((a, b) => b - a);
    const total = uids.length;
    const pageUids = uids.slice((page - 1) * limit, page * limit);
    if (pageUids.length === 0) return { messages: [], total, page, limit };

    const messages = [];
    for await (const msg of client.fetch(pageUids, {
      uid: true, flags: true, envelope: true,
      bodyStructure: true, internalDate: true, bodyParts: ['TEXT'],
    }, { uid: true })) {
      let preview = '';
      try {
        const tp = msg.bodyParts?.get('TEXT');
        if (tp) preview = tp.toString('utf8').replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
      } catch {}
      const hasAttachments = (msg.bodyStructure?.childNodes || []).some(n => {
        const d = (n.disposition || '').toLowerCase();
        const t = (n.type || '').toLowerCase();
        return d === 'attachment' || (!t.startsWith('text/') && !t.startsWith('multipart/') && t !== '');
      });
      messages.push({
        uid: msg.uid, seq: msg.seq,
        subject: msg.envelope?.subject || '(no subject)',
        from: msg.envelope?.from?.[0] || null,
        to: msg.envelope?.to || [],
        date: msg.internalDate || msg.envelope?.date || null,
        flags: [...(msg.flags || [])],
        isRead: (msg.flags || new Set()).has('\\Seen'),
        isStarred: true,
        preview, hasAttachments,
        sourceFolder: folder,
      });
    }
    messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    return { messages, total, page, limit };
  } finally {
    await client.logout();
  }
}

/**
 * Permanently delete a message (move to Trash first, then expunge).
 */
export async function deleteMessage(accountEmail, folder, uid) {
  const client = createClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(folder);
    await client.messageFlagsAdd({ uid }, ['\\Deleted'], { uid: true });
    await client.mailboxClose();
  } finally {
    await client.logout();
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Parse a raw RFC 2822 email source (Buffer or string) into { html, text, attachments }.
 * Handles multipart boundaries, base64, and quoted-printable encoding.
 * attachments = [{ filename, contentType, size }]
 */
function parseEmailBody(source) {
  // Normalise to Buffer for binary-safe slicing
  const buf = Buffer.isBuffer(source) ? source : Buffer.from(source, 'binary');

  // Find header/body split (blank line)
  let splitIdx = -1;
  let splitLen = 2;
  for (let i = 0; i < buf.length - 1; i++) {
    if (buf[i] === 0x0d && buf[i+1] === 0x0a && buf[i+2] === 0x0d && buf[i+3] === 0x0a) {
      splitIdx = i; splitLen = 4; break;
    }
    if (buf[i] === 0x0a && buf[i+1] === 0x0a) {
      splitIdx = i; splitLen = 2; break;
    }
  }

  if (splitIdx === -1) return { html: null, text: '', attachments: [] };

  const headerStr  = buf.slice(0, splitIdx).toString('utf8');
  const bodyBuf    = buf.slice(splitIdx + splitLen);

  const contentType = getHeader(headerStr, 'content-type') || 'text/plain';
  const encoding    = getHeader(headerStr, 'content-transfer-encoding') || '7bit';
  const disposition = getHeader(headerStr, 'content-disposition') || '';
  const ctLower     = contentType.toLowerCase();

  // Attachment part — return metadata only (no inline rendering)
  if (disposition.toLowerCase().startsWith('attachment')) {
    const filename = extractFilename(contentType, disposition);
    return {
      html: null, text: null,
      attachments: [{ filename, contentType: ctLower.split(';')[0].trim(), size: bodyBuf.length }],
    };
  }

  // Simple (non-multipart) message
  if (!ctLower.includes('multipart')) {
    const charset = extractCharset(contentType);
    const decoded = decodeBody(bodyBuf, encoding, charset);
    if (ctLower.includes('text/html')) {
      return { html: decoded, text: null, attachments: [] };
    }
    return { html: null, text: decoded, attachments: [] };
  }

  // Multipart — extract boundary
  const boundaryMatch = contentType.match(/boundary=["']?([^"';\r\n]+)["']?/i);
  if (!boundaryMatch) return { html: null, text: '', attachments: [] };

  const boundary = boundaryMatch[1].trim().replace(/["']$/, '');
  const parts = splitMimeParts(buf, boundary);

  let html = null;
  let text = null;
  const attachments = [];

  for (const part of parts) {
    const result = parseEmailBody(part);
    if (result.html && !html) html = result.html;
    if (result.text && !text) text = result.text;
    if (result.attachments?.length) attachments.push(...result.attachments);
  }

  return { html, text, attachments };
}

function getHeader(headerSection, name) {
  // Unfold multi-line headers first
  const unfolded = headerSection.replace(/\r?\n[ \t]+/g, ' ');
  const lines = unfolded.split(/\r?\n/);
  for (const line of lines) {
    if (line.toLowerCase().startsWith(name.toLowerCase() + ':')) {
      return line.slice(name.length + 1).trim();
    }
  }
  return null;
}

function splitMimeParts(buf, boundary) {
  const delim = Buffer.from('--' + boundary);
  const parts = [];

  let pos = bufIndexOf(buf, delim, 0);
  if (pos === -1) return parts;

  while (true) {
    // Skip past the delimiter line
    const lineEnd = bufIndexOf(buf, Buffer.from('\n'), pos);
    if (lineEnd === -1) break;
    const partStart = lineEnd + 1;

    // Find next delimiter
    const nextDelimPos = bufIndexOf(buf, delim, partStart);
    if (nextDelimPos === -1) break;

    // Strip trailing \r\n before delimiter
    let partEnd = nextDelimPos;
    if (partEnd > 0 && buf[partEnd - 1] === 0x0a) partEnd--;
    if (partEnd > 0 && buf[partEnd - 1] === 0x0d) partEnd--;

    parts.push(buf.slice(partStart, partEnd));
    pos = nextDelimPos;

    // Check for closing boundary (--boundary--)
    const afterDelim = buf.slice(nextDelimPos + delim.length, nextDelimPos + delim.length + 2).toString();
    if (afterDelim === '--') break;
  }

  return parts;
}

function bufIndexOf(buf, search, fromIndex = 0) {
  for (let i = fromIndex; i <= buf.length - search.length; i++) {
    let match = true;
    for (let j = 0; j < search.length; j++) {
      if (buf[i + j] !== search[j]) { match = false; break; }
    }
    if (match) return i;
  }
  return -1;
}

function extractCharset(contentType) {
  const m = contentType.match(/charset=["']?([^"';\s]+)["']?/i);
  return (m ? m[1] : 'utf-8').toLowerCase().replace('utf8', 'utf-8');
}

function extractFilename(contentType, disposition) {
  const sources = [disposition, contentType];
  for (const s of sources) {
    const m = s.match(/(?:filename|name)\*?=["']?(?:utf-8'')?([^"';\r\n]+)["']?/i);
    if (m) return decodeURIComponent(m[1].trim());
  }
  return 'attachment';
}

function decodeBody(bodyBuf, encoding, charset = 'utf-8') {
  const enc = (encoding || '').toLowerCase().trim();
  try {
    if (enc === 'base64') {
      const cleaned = bodyBuf.toString('ascii').replace(/\s+/g, '');
      const decoded = Buffer.from(cleaned, 'base64');
      return decoded.toString(charset === 'utf-8' ? 'utf8' : 'latin1');
    }
    if (enc === 'quoted-printable') {
      return decodeQuotedPrintable(bodyBuf.toString('binary'), charset);
    }
  } catch {
    // fall through
  }
  return bodyBuf.toString(charset === 'utf-8' ? 'utf8' : 'latin1');
}

function decodeQuotedPrintable(str, charset = 'utf-8') {
  // Remove soft line breaks
  const joined = str.replace(/=\r?\n/g, '');
  // Collect raw bytes
  const bytes = [];
  let i = 0;
  while (i < joined.length) {
    if (joined[i] === '=' && i + 2 < joined.length) {
      const hex = joined.slice(i + 1, i + 3);
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        bytes.push(parseInt(hex, 16));
        i += 3;
        continue;
      }
    }
    bytes.push(joined.charCodeAt(i) & 0xff);
    i++;
  }
  return Buffer.from(bytes).toString(charset === 'utf-8' ? 'utf8' : 'latin1');
}
