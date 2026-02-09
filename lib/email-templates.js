/**
 * Email template library for DAGARMY
 * All templates return plain HTML strings for use with Nodemailer
 */

const BRAND = {
  name: 'DAGARMY',
  url: 'https://dagarmy.network',
  logo: 'https://dagarmy.network/images/logo/logo.png',
  support: 'support@dagarmy.network',
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
};

// Shared layout wrapper
function layout(content, previewText = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${BRAND.name}</title>
  ${previewText ? `<span style="display:none;font-size:1px;color:#fff;max-height:0;overflow:hidden;">${previewText}</span>` : ''}
</head>
<body style="margin:0;padding:0;background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f9fc;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding:32px 40px 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:12px;">
                    <img src="${BRAND.logo}" width="40" height="40" alt="${BRAND.name}" style="display:block;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:22px;font-weight:700;color:#1f2937;letter-spacing:0.5px;">${BRAND.name}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${content}
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;border-top:1px solid #e6ebf1;">
              <p style="color:#8898aa;font-size:12px;line-height:1.5;margin:8px 0;">
                &copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
              </p>
              <p style="color:#8898aa;font-size:12px;line-height:1.5;margin:8px 0;">
                You're receiving this email because you're a member of ${BRAND.name}.
              </p>
              <p style="margin:12px 0 0;">
                <a href="${BRAND.url}" style="color:${BRAND.primaryColor};font-size:12px;text-decoration:none;">Website</a>
                &nbsp;&bull;&nbsp;
                <a href="${BRAND.url}/courses" style="color:${BRAND.primaryColor};font-size:12px;text-decoration:none;">Courses</a>
                &nbsp;&bull;&nbsp;
                <a href="${BRAND.url}/about" style="color:${BRAND.primaryColor};font-size:12px;text-decoration:none;">About</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Welcome email for new student sign-ups
 */
export function welcomeEmailTemplate(userName = 'there') {
  const content = `
    <!-- Hero -->
    <tr>
      <td style="padding:0 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,${BRAND.primaryColor} 0%,${BRAND.secondaryColor} 100%);border-radius:12px;">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:32px;font-weight:bold;margin:0 0 12px;line-height:1.3;">Welcome to ${BRAND.name}!</h1>
              <p style="color:#ffffff;font-size:18px;line-height:1.6;margin:0;opacity:0.95;">
                Hey ${userName}, we're thrilled to have you join the Global Army of Vibe Coders!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:32px 40px;">
        <p style="color:#525f7f;font-size:16px;line-height:1.6;margin:0 0 24px;">
          You've just taken the first step towards mastering cutting-edge technologies like
          <strong>AI, Blockchain, and Data Visualization</strong>. Get ready for an incredible learning journey!
        </p>

        <!-- Cards -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#f8f9fa;border-radius:8px;padding:20px;text-align:center;">
              <p style="font-size:20px;font-weight:bold;color:#1a1a1a;margin:0 0 4px;">Explore Courses</p>
              <p style="color:#525f7f;font-size:14px;line-height:1.5;margin:0;">Browse our comprehensive curriculum designed by industry experts</p>
            </td>
          </tr>
          <tr><td style="height:12px;"></td></tr>
          <tr>
            <td style="background-color:#f8f9fa;border-radius:8px;padding:20px;text-align:center;">
              <p style="font-size:20px;font-weight:bold;color:#1a1a1a;margin:0 0 4px;">Set Your Goals</p>
              <p style="color:#525f7f;font-size:14px;line-height:1.5;margin:0;">Complete your profile and start tracking your learning progress</p>
            </td>
          </tr>
          <tr><td style="height:12px;"></td></tr>
          <tr>
            <td style="background-color:#f8f9fa;border-radius:8px;padding:20px;text-align:center;">
              <p style="font-size:20px;font-weight:bold;color:#1a1a1a;margin:0 0 4px;">Join Community</p>
              <p style="color:#525f7f;font-size:14px;line-height:1.5;margin:0;">Connect with fellow learners and share your journey</p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
          <tr>
            <td align="center">
              <a href="${BRAND.url}" style="background-color:${BRAND.primaryColor};border-radius:8px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;display:inline-block;padding:14px 40px;">
                Get Started Now
              </a>
            </td>
          </tr>
        </table>

        <!-- Next Steps -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:8px;">
          <tr>
            <td style="padding:24px;">
              <h2 style="color:#1a1a1a;font-size:22px;font-weight:bold;margin:0 0 16px;">What's Next?</h2>
              <p style="color:#525f7f;font-size:16px;line-height:2;margin:0;">
                &#10003; Complete your profile<br/>
                &#10003; Browse available courses<br/>
                &#10003; Join your first program<br/>
                &#10003; Start earning DAG points
              </p>
            </td>
          </tr>
        </table>

        <hr style="border:none;border-top:1px solid #e6ebf1;margin:32px 0;" />

        <p style="color:#525f7f;font-size:16px;line-height:1.6;margin:0 0 8px;">
          Need help getting started? Our support team is here for you!
        </p>
        <p style="color:#525f7f;font-size:16px;line-height:1.6;margin:0;">
          Email us at <a href="mailto:${BRAND.support}" style="color:${BRAND.primaryColor};text-decoration:underline;">${BRAND.support}</a>
        </p>
      </td>
    </tr>`;

  return layout(content, 'Welcome to DAGARMY - Master AI, Blockchain & Data Visualization');
}

/**
 * Generic announcement / custom email from admin or trainer
 */
export function announcementEmailTemplate({ title, body, ctaText, ctaUrl, senderName }) {
  const content = `
    <!-- Hero -->
    <tr>
      <td style="padding:0 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,${BRAND.primaryColor} 0%,${BRAND.secondaryColor} 100%);border-radius:12px;">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:28px;font-weight:bold;margin:0;line-height:1.3;">${title}</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:32px 40px;">
        ${senderName ? `<p style="color:#8898aa;font-size:13px;margin:0 0 16px;">From: <strong style="color:#525f7f;">${senderName}</strong></p>` : ''}
        <div style="color:#525f7f;font-size:16px;line-height:1.7;">
          ${body}
        </div>
        ${ctaText && ctaUrl ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
          <tr>
            <td align="center">
              <a href="${ctaUrl}" style="background-color:${BRAND.primaryColor};border-radius:8px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;display:inline-block;padding:14px 40px;">
                ${ctaText}
              </a>
            </td>
          </tr>
        </table>` : ''}
      </td>
    </tr>`;

  return layout(content, title);
}

/**
 * Course enrollment confirmation email
 */
export function courseEnrollmentEmailTemplate({ userName, courseName, startDate }) {
  const content = `
    <!-- Hero -->
    <tr>
      <td style="padding:0 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,${BRAND.primaryColor} 0%,${BRAND.secondaryColor} 100%);border-radius:12px;">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:28px;font-weight:bold;margin:0 0 12px;line-height:1.3;">You're Enrolled!</h1>
              <p style="color:#ffffff;font-size:16px;line-height:1.6;margin:0;opacity:0.95;">
                ${courseName}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:32px 40px;">
        <p style="color:#525f7f;font-size:16px;line-height:1.6;margin:0 0 24px;">
          Hey ${userName}, congratulations on enrolling in <strong>${courseName}</strong>!
          ${startDate ? `The course starts on <strong>${startDate}</strong>.` : 'You can start learning right away.'}
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
          <tr>
            <td align="center">
              <a href="${BRAND.url}/dashboard" style="background-color:${BRAND.primaryColor};border-radius:8px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;display:inline-block;padding:14px 40px;">
                Go to Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  return layout(content, `You're enrolled in ${courseName}`);
}
