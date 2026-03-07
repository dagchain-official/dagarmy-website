import nodemailer from 'nodemailer';

const ACCOUNT_MAP = {
  'admin@dagchain.network':     'EMAIL_ADMIN',
  'support@dagchain.network':   'EMAIL_SUPPORT',
  'hr@dagchain.network':        'EMAIL_HR',
  'careers@dagchain.network':   'EMAIL_CAREERS',
  'marketing@dagchain.network': 'EMAIL_MARKETING',
};

const DISPLAY_NAME_MAP = {
  'admin@dagchain.network':     'Admin DAGChain',
  'support@dagchain.network':   'Support DAGChain',
  'hr@dagchain.network':        'HR DAGChain',
  'careers@dagchain.network':   'Careers DAGChain',
  'marketing@dagchain.network': 'Marketing DAGChain',
};

function getCredentials(accountEmail) {
  const key = ACCOUNT_MAP[accountEmail];
  if (!key) throw new Error(`No SMTP credentials configured for: ${accountEmail}`);

  const user = process.env[`${key}_USER`];
  const pass = process.env[`${key}_PASS`];

  if (!user || !pass) {
    throw new Error(`Missing env vars ${key}_USER or ${key}_PASS`);
  }

  return { user, pass };
}

function createTransporter(accountEmail) {
  const { user, pass } = getCredentials(accountEmail);
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'premium166.web-hosting.com',
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: false,
      servername: process.env.SMTP_HOST || 'premium166.web-hosting.com',
    },
  });
}

/**
 * Send an email from the given department account.
 * @param {string} accountEmail - The sender's department email
 * @param {object} options
 * @param {string|string[]} options.to
 * @param {string|string[]} [options.cc]
 * @param {string|string[]} [options.bcc]
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 * @param {string} [options.replyTo]
 * @returns {{ messageId: string }}
 */
export async function sendEmail(accountEmail, { to, cc, bcc, subject, html, text, replyTo, attachments = [] }) {
  const transporter = createTransporter(accountEmail);
  const displayName = DISPLAY_NAME_MAP[accountEmail];
  const fromField = displayName ? `"${displayName}" <${accountEmail}>` : accountEmail;

  const info = await transporter.sendMail({
    from: fromField,
    to: Array.isArray(to) ? to.join(', ') : to,
    cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
    bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
    replyTo: replyTo || accountEmail,
    subject,
    html,
    text: text || html?.replace(/<[^>]+>/g, '') || '',
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  return { messageId: info.messageId };
}

/**
 * Verify SMTP connection for an account.
 * Returns true if connection succeeds, false otherwise.
 */
export async function verifySmtpConnection(accountEmail) {
  try {
    const transporter = createTransporter(accountEmail);
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}
