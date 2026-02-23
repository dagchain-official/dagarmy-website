import { NextResponse } from 'next/server';
import { getAdminSession, requirePermission } from '@/lib/admin-auth';
import { ImapFlow } from 'imapflow';

const ACCOUNT_MAP = {
  'admin@dagchain.network':     'EMAIL_ADMIN',
  'support@dagchain.network':   'EMAIL_SUPPORT',
  'hr@dagchain.network':        'EMAIL_HR',
  'careers@dagchain.network':   'EMAIL_CAREERS',
  'marketing@dagchain.network': 'EMAIL_MARKETING',
};

function createClient(accountEmail) {
  const key = ACCOUNT_MAP[accountEmail];
  if (!key) throw new Error(`No credentials for: ${accountEmail}`);
  const user = process.env[`${key}_USER`];
  const pass = process.env[`${key}_PASS`];
  if (!user || !pass) throw new Error(`Missing env vars for ${key}`);

  const port = parseInt(process.env.IMAP_PORT || '993');
  const secure = port !== 143 && port !== 110;
  return new ImapFlow({
    host: process.env.IMAP_HOST || 'premium166.web-hosting.com',
    port,
    secure,
    auth: { user, pass },
    logger: false,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    ...(secure ? { tls: { rejectUnauthorized: false, servername: process.env.IMAP_HOST } } : {}),
  });
}

/**
 * GET /api/admin/email/attachment?folder=INBOX&uid=123&part=1.2&filename=file.pdf
 * Downloads a specific MIME body part using imapflow's bodyPart fetch.
 * `part` is the IMAP body part section number (e.g. "2", "1.2").
 */
export async function GET(request) {
  const guard = await requirePermission(request, 'notifications.read');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;
  if (!accountEmail) {
    return NextResponse.json({ error: 'No department email configured' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const folder   = searchParams.get('folder') || 'INBOX';
  const uid      = parseInt(searchParams.get('uid'));
  const part     = searchParams.get('part') || '2';
  const filename = searchParams.get('filename') || 'attachment';

  if (!uid) return NextResponse.json({ error: 'uid required' }, { status: 400 });

  const client = createClient(accountEmail);
  await client.connect();
  try {
    await client.mailboxOpen(folder, { readOnly: true });

    // Fetch raw source + bodyStructure in one call
    let sourceBuf = null;
    let bodyStructure = null;
    for await (const msg of client.fetch({ uid }, { source: true, bodyStructure: true }, { uid: true })) {
      sourceBuf = msg.source instanceof Buffer ? msg.source : Buffer.from(msg.source || '');
      bodyStructure = msg.bodyStructure;
    }
    if (!sourceBuf || !bodyStructure) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const attachIdx = parseInt(part) || 1;
    const partNode = findAttachmentPart(bodyStructure, attachIdx);
    if (!partNode) {
      return NextResponse.json({ error: `Attachment ${attachIdx} not found` }, { status: 404 });
    }

    // Extract the attachment body from the raw source using the boundary from bodyStructure
    const rawPartBuf = extractAttachmentFromSource(sourceBuf, bodyStructure, attachIdx);
    if (!rawPartBuf || rawPartBuf.length === 0) {
      return NextResponse.json({ error: 'Attachment data empty' }, { status: 404 });
    }

    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const mimeType = MIME_TYPES[ext] || partNode.fullType || 'application/octet-stream';

    // Slice to get a clean ArrayBuffer (Buffer may have offset/length != underlying ArrayBuffer)
    const arrayBuf = rawPartBuf.buffer.slice(
      rawPartBuf.byteOffset,
      rawPartBuf.byteOffset + rawPartBuf.byteLength
    );

    return new NextResponse(arrayBuf, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(rawPartBuf.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } finally {
    await client.logout();
  }
}

/**
 * Extract the nth attachment from raw source using bodyStructure boundary info.
 * Uses the outer boundary from bodyStructure to split parts, then finds
 * the nth non-text part and base64-decodes it.
 */
function extractAttachmentFromSource(sourceBuf, bodyStructure, attachIdx) {
  const src = sourceBuf.toString('binary');

  // Get the outer boundary from bodyStructure parameters
  const outerBoundary = bodyStructure?.parameters?.boundary;
  if (!outerBoundary) {
    // Single part — just decode the body
    const bodyStart = src.indexOf('\r\n\r\n') !== -1
      ? src.indexOf('\r\n\r\n') + 4
      : src.indexOf('\n\n') + 2;
    return Buffer.from(src.slice(bodyStart).replace(/\s+/g, ''), 'base64');
  }

  const delim = '--' + outerBoundary;
  const rawParts = [];
  let pos = src.indexOf(delim);

  while (pos !== -1) {
    const lineEnd = src.indexOf('\n', pos);
    if (lineEnd === -1) break;
    const partStart = lineEnd + 1;
    const nextPos = src.indexOf('\n' + delim, partStart);
    if (nextPos === -1) break;
    rawParts.push(src.slice(partStart, nextPos));
    pos = nextPos + 1;
    if (src.slice(pos + delim.length, pos + delim.length + 2) === '--') break;
  }

  let attCount = 0;
  for (const rawPart of rawParts) {
    // Find header/body split
    const crlfIdx = rawPart.indexOf('\r\n\r\n');
    const lfIdx   = rawPart.indexOf('\n\n');
    const splitIdx = crlfIdx !== -1 ? crlfIdx : lfIdx;
    if (splitIdx === -1) continue;

    const hdr  = rawPart.slice(0, splitIdx);
    const body = rawPart.slice(splitIdx + (crlfIdx !== -1 ? 4 : 2));

    const ctLine  = (hdr.match(/Content-Type:\s*([^\r\n;]+)/i) || [])[1] || '';
    const encLine = (hdr.match(/Content-Transfer-Encoding:\s*([^\r\n]+)/i) || [])[1] || 'base64';
    const ctLower = ctLine.toLowerCase().trim();

    // Skip text and multipart parts
    if (ctLower.startsWith('text/') || ctLower.startsWith('multipart/')) continue;

    attCount++;
    if (attCount === attachIdx) {
      const enc = encLine.toLowerCase().trim();
      if (enc === 'base64') {
        return Buffer.from(body.replace(/\s+/g, ''), 'base64');
      }
      return Buffer.from(body, 'binary');
    }
  }

  return null;
}

/**
 * Walk bodyStructure tree, collect all attachment parts in order,
 * return the nth one (1-based) with { encoding, type, subtype, parameters }.
 */
function findAttachmentPart(struct, targetIdx) {
  const attachments = [];

  function walk(node) {
    if (!node) return;
    if (node.childNodes?.length) {
      node.childNodes.forEach(walk);
    } else {
      // imapflow uses full MIME type string e.g. "application/pdf", "text/plain"
      const fullType = (node.type || '').toLowerCase();
      const disp     = (node.disposition || '').toLowerCase();
      const isAtt    = disp === 'attachment' ||
        (!fullType.startsWith('text/') && !fullType.startsWith('multipart/') && fullType !== '');
      if (isAtt) {
        const [typeMain, typeSub] = fullType.split('/');
        attachments.push({
          section:    node.part || '1',
          encoding:   (node.encoding || 'base64').toLowerCase(),
          type:       typeMain || 'application',
          subtype:    typeSub  || 'octet-stream',
          fullType,
          parameters: node.parameters || {},
          dispositionParameters: node.dispositionParameters || {},
        });
      }
    }
  }

  walk(struct);
  return attachments[targetIdx - 1] || null;
}


const MIME_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  zip: 'application/zip',
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
};
