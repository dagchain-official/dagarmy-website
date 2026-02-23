import { NextResponse } from 'next/server';
import { requireMasterAdmin } from '@/lib/admin-auth';
import net from 'net';

function testTcpPort(host, port, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;

    const done = (result) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(result);
      }
    };

    socket.setTimeout(timeoutMs);
    socket.on('connect', () => done({ open: true }));
    socket.on('timeout', () => done({ open: false, reason: 'timeout' }));
    socket.on('error', (err) => done({ open: false, reason: err.message }));
    socket.connect(port, host);
  });
}

/**
 * GET /api/admin/email/test
 * Master-admin only. Tests TCP reachability of IMAP/SMTP host+port.
 */
export async function GET(request) {
  const guard = await requireMasterAdmin(request);
  if (guard) return guard;

  const host = process.env.IMAP_HOST || 'dagchain.network';
  const imapPort = parseInt(process.env.IMAP_PORT || '993');
  const smtpPort = parseInt(process.env.SMTP_PORT || '465');

  const [imap993, imap143, smtp465, smtp587] = await Promise.all([
    testTcpPort(host, 993),
    testTcpPort(host, 143),
    testTcpPort(host, 465),
    testTcpPort(host, 587),
  ]);

  return NextResponse.json({
    host,
    configured: { imapPort, smtpPort },
    connectivity: {
      'IMAP 993 (SSL)':  imap993,
      'IMAP 143 (plain)': imap143,
      'SMTP 465 (SSL)':  smtp465,
      'SMTP 587 (STARTTLS)': smtp587,
    },
    env: {
      IMAP_HOST: process.env.IMAP_HOST || '(not set)',
      IMAP_PORT: process.env.IMAP_PORT || '(not set)',
      SMTP_HOST: process.env.SMTP_HOST || '(not set)',
      SMTP_PORT: process.env.SMTP_PORT || '(not set)',
      EMAIL_ADMIN_USER: process.env.EMAIL_ADMIN_USER ? '(set)' : '(NOT SET)',
      EMAIL_ADMIN_PASS: process.env.EMAIL_ADMIN_PASS ? '(set)' : '(NOT SET)',
    },
  });
}
