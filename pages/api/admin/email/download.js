import { ImapFlow } from 'imapflow';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const ACCOUNT_MAP = {
  'admin@dagchain.network':     'EMAIL_ADMIN',
  'support@dagchain.network':   'EMAIL_SUPPORT',
  'hr@dagchain.network':        'EMAIL_HR',
  'careers@dagchain.network':   'EMAIL_CAREERS',
  'marketing@dagchain.network': 'EMAIL_MARKETING',
};

function createImapClient(accountEmail) {
  const key = ACCOUNT_MAP[accountEmail];
  if (!key) throw new Error(`No credentials for: ${accountEmail}`);
  const user = process.env[`${key}_USER`];
  const pass = process.env[`${key}_PASS`];
  if (!user || !pass) throw new Error(`Missing env vars for ${key}`);
  const port = parseInt(process.env.IMAP_PORT || '993');
  const secure = port !== 143 && port !== 110;
  return new ImapFlow({
    host: process.env.IMAP_HOST || 'premium166.web-hosting.com',
    port, secure,
    auth: { user, pass },
    logger: false,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    ...(secure ? { tls: { rejectUnauthorized: false, servername: process.env.IMAP_HOST } } : {}),
  });
}

const MASTER_ADMIN_EMAIL = process.env.MASTER_ADMIN_EMAIL || 'admin@dagchain.network';

async function getSessionEmail(req) {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    if (!match) return null;
    const sessionToken = match[1];

    const { data: session } = await supabase
      .from('admin_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single();
    if (!session) return null;
    if (new Date(session.expires_at) < new Date()) return null;

    const { data: user } = await supabase
      .from('users')
      .select('id, email, is_admin, is_master_admin')
      .eq('id', session.user_id)
      .single();
    if (!user || (!user.is_admin && !user.is_master_admin)) return null;

    const isMaster = user.is_master_admin || user.email === MASTER_ADMIN_EMAIL;
    if (isMaster) return MASTER_ADMIN_EMAIL;

    const { data: role } = await supabase
      .from('admin_roles')
      .select('department_email')
      .eq('user_id', user.id)
      .single();
    return role?.department_email || user.email;
  } catch { return null; }
}

function findAttachmentPart(struct, targetIdx) {
  const attachments = [];
  function walk(node) {
    if (!node) return;
    if (node.childNodes?.length) { node.childNodes.forEach(walk); return; }
    const fullType = (node.type || '').toLowerCase();
    const disp = (node.disposition || '').toLowerCase();
    if (disp === 'attachment' || (!fullType.startsWith('text/') && !fullType.startsWith('multipart/') && fullType !== '')) {
      attachments.push({ fullType });
    }
  }
  walk(struct);
  return attachments[targetIdx - 1] || null;
}

function extractAttachment(sourceBuf, bodyStructure, attachIdx) {
  const src = sourceBuf.toString('binary');
  const outerBoundary = bodyStructure?.parameters?.boundary;
  if (!outerBoundary) {
    const bi = src.indexOf('\r\n\r\n') !== -1 ? src.indexOf('\r\n\r\n') + 4 : src.indexOf('\n\n') + 2;
    return Buffer.from(src.slice(bi).replace(/\s+/g, ''), 'base64');
  }
  const delim = '--' + outerBoundary;
  const rawParts = [];
  let pos = src.indexOf(delim);
  while (pos !== -1) {
    const le = src.indexOf('\n', pos);
    if (le === -1) break;
    const ps = le + 1;
    const np = src.indexOf('\n' + delim, ps);
    if (np === -1) break;
    rawParts.push(src.slice(ps, np));
    pos = np + 1;
    if (src.slice(pos + delim.length, pos + delim.length + 2) === '--') break;
  }
  let attCount = 0;
  for (const rawPart of rawParts) {
    const ci = rawPart.indexOf('\r\n\r\n') !== -1 ? rawPart.indexOf('\r\n\r\n') : rawPart.indexOf('\n\n');
    if (ci === -1) continue;
    const hdr = rawPart.slice(0, ci);
    const body = rawPart.slice(ci + (rawPart[ci + 2] === '\n' ? 4 : 2));
    const ct = ((hdr.match(/Content-Type:\s*([^\r\n;]+)/i) || [])[1] || '').toLowerCase().trim();
    const enc = ((hdr.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) || [])[1] || 'base64').toLowerCase().trim();
    if (ct.startsWith('text/') || ct.startsWith('multipart/')) continue;
    attCount++;
    if (attCount === attachIdx) {
      return enc === 'base64'
        ? Buffer.from(body.replace(/\s+/g, ''), 'base64')
        : Buffer.from(body, 'binary');
    }
  }
  return null;
}

const MIME_TYPES = {
  pdf: 'application/pdf', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', webp: 'image/webp', zip: 'application/zip',
  txt: 'text/plain', csv: 'text/csv', mp4: 'video/mp4', mp3: 'audio/mpeg',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.status(405).end(); return; }

  const accountEmail = await getSessionEmail(req);
  if (!accountEmail) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const { folder = 'INBOX', uid, part = '1', filename = 'attachment' } = req.query;
  const uidNum = parseInt(uid);
  if (!uidNum) { res.status(400).json({ error: 'uid required' }); return; }

  const client = createImapClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(folder, { readOnly: true });
    let sourceBuf = null, bodyStructure = null;
    for await (const msg of client.fetch({ uid: uidNum }, { source: true, bodyStructure: true }, { uid: true })) {
      sourceBuf = msg.source instanceof Buffer ? msg.source : Buffer.from(msg.source || '');
      bodyStructure = msg.bodyStructure;
    }
    if (!sourceBuf) { res.status(404).json({ error: 'Message not found' }); return; }

    const attachIdx = parseInt(part) || 1;
    const decoded = extractAttachment(sourceBuf, bodyStructure, attachIdx);
    if (!decoded || decoded.length === 0) { res.status(404).json({ error: 'Attachment empty' }); return; }

    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      data: decoded.toString('base64'),
      mimeType,
      filename,
      size: decoded.length,
    });
  } finally {
    await client.logout();
  }
}
