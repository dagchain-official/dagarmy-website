import nodemailer from 'nodemailer';

// Create reusable SMTP transporter using Namecheap hosting credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: parseInt(process.env.SMTP_PORT || '465') === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Namecheap shared hosting sometimes needs this
  },
});

/**
 * Send a single email
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text fallback
 * @param {string} [options.from] - Override default sender
 * @param {string} [options.replyTo] - Reply-to address
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendEmail({ to, subject, html, text, from, replyTo }) {
  try {
    const info = await transporter.sendMail({
      from: from || `${process.env.SMTP_FROM_NAME || 'DAGARMY'} <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for plain text fallback
      replyTo: replyTo || process.env.SMTP_USER,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send bulk emails (one at a time to avoid SMTP rate limits)
 * @param {Array<{to: string, subject: string, html: string, text?: string}>} emails
 * @param {Object} [defaults] - Default values for from, replyTo
 * @returns {Promise<{sent: number, failed: number, results: Array}>}
 */
export async function sendBulkEmails(emails, defaults = {}) {
  const results = [];
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const result = await sendEmail({
      ...defaults,
      ...email,
    });

    results.push({ to: email.to, ...result });

    if (result.success) {
      sent++;
    } else {
      failed++;
    }

    // Small delay between emails to respect SMTP rate limits
    if (emails.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return { sent, failed, results };
}

/**
 * Verify SMTP connection is working
 * @returns {Promise<{connected: boolean, error?: string}>}
 */
export async function verifyConnection() {
  try {
    await transporter.verify();
    return { connected: true };
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    return { connected: false, error: error.message };
  }
}
