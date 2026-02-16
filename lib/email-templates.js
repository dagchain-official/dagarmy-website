/**
 * Email template library for DAGARMY
 * Based on the DAGChain mailer design template
 * All templates return plain HTML strings for use with Nodemailer
 */

// Always use production URL for email images - email clients need publicly accessible URLs
const IMG = 'https://dagarmy.network/mailer-DAGChain/images';

const BRAND = {
  name: 'DAGARMY',
  url: 'https://dagarmy.network',
  dagchainUrl: 'https://www.dagchain.network',
  support: 'support@dagarmy.network',
};

// Shared signature + footer block used across all templates
function signatureBlock() {
  return `
    <tr>
      <td style="background: #ffffff; padding:30px 8% 25px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <div style="background: #ffffff; border-radius: 11px; padding:15px 10px; border: 2px solid rgba(112, 112, 112, 0.2); box-shadow: rgba(0,0,0,0.1) 2px 4px 3px; margin-bottom: 25px;">
                <p style="font-size: 13px; line-height:18px; font-weight: 500; color:#000000; text-align: center; margin: 0;">
                  This Is An Automated Message, Please Do Not Respond To This.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style="width:160px; display: inline-block; text-align: left; margin:0; vertical-align: middle;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tbody><tr><td>
                    <table><tbody><tr>
                      <td style="background-color: #F0F1FE; width: 127px; height: 127px; line-height: 127px; border-radius: 100px; text-align: center;">
                        <img src="${IMG}/logo_dagchain_sm.png" alt="DAGChain" style="width:66px; object-fit: contain; display: inline-block; vertical-align: middle; margin:0;">
                      </td>
                    </tr></tbody></table>
                  </td></tr></tbody>
                </table>
              </div>
              <div style="width:100%; max-width:400px; display: inline-block; margin:5px 0; vertical-align: middle; text-align: left;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tbody><tr><td>
                    <table><tbody>
                      <tr>
                        <td style="padding: 0;">
                          <p style="width:100%; font-size:14px; line-height:26px; font-weight:700; font-family: 'Poppins', sans-serif; color:#0022FD; margin:0; display: inline-block;">
                            Warm Regards,
                          </p>
                          <p style="width:100%; font-size:20px; line-height:24px; font-weight:600; font-family: 'Poppins', sans-serif; color:#000000; margin:0; display: inline-block;">
                            DAGARMY Support Team
                          </p>
                          <p style="width:100%; font-size:14px; line-height:22px; font-weight:500; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 7px; display: inline-block;">
                            DAGChain | DAG Army
                          </p>
                          <p style="width:100%; margin: 0;">
                            <img src="${IMG}/icon_web.png" alt="" style="width:14px; object-fit: contain; display: inline-block; float: left; vertical-align: middle; margin:0 7px 5px 0;">
                            <a href="${BRAND.dagchainUrl}" style="font-size:12px; line-height:12px; font-weight:500; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 5px; text-decoration: none; float:left;">
                              www.dagchain.network
                            </a>
                            <span style="font-size:12px; line-height:12px; font-weight:500; font-family: 'Poppins', sans-serif; color:#000000; float: left; margin: 0 7px 5px;">|</span>
                            <a href="${BRAND.url}" style="font-size:12px; line-height:12px; font-weight:500; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 5px; text-decoration: none; float:left;">
                              www.dagarmy.network
                            </a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="https://www.linkedin.com/company/dag-chain" target="_blank" style="text-decoration: none; display: inline-block; margin: 0 5px 5px; vertical-align: middle;">
                            <img src="${IMG}/icon_linkedin.png" alt="LinkedIn" style="display: inline-block; vertical-align: middle;">
                          </a>
                          <a href="https://www.facebook.com/people/DagChain/61584495032870/" target="_blank" style="text-decoration: none; display: inline-block; margin: 0 5px 5px; vertical-align: middle;">
                            <img src="${IMG}/icon_facebook.png" alt="Facebook" style="display: inline-block; vertical-align: middle;">
                          </a>
                          <a href="https://x.com/dagchain_ai" target="_blank" style="text-decoration: none; display: inline-block; margin: 0 5px 5px; vertical-align: middle;">
                            <img src="${IMG}/icon_twitter.png" alt="X" style="display: inline-block; vertical-align: middle;">
                          </a>
                          <a href="https://www.instagram.com/dagchain.network/" target="_blank" style="text-decoration: none; display: inline-block; margin: 0 5px 5px; vertical-align: middle;">
                            <img src="${IMG}/icon_instagrame.png" alt="Instagram" style="display: inline-block; vertical-align: middle;">
                          </a>
                          <a href="https://www.pinterest.com/DAGCHAIN/" target="_blank" style="text-decoration: none; display: inline-block; margin: 0 5px 5px; vertical-align: middle;">
                            <img src="${IMG}/icon_pintrest.png" alt="Pinterest" style="display: inline-block; vertical-align: middle;">
                          </a>
                          <a href="https://www.youtube.com/@dagchain.network" target="_blank" style="text-decoration: none; display: inline-block; margin: 0 5px 5px; vertical-align: middle;">
                            <img src="${IMG}/icon_youtube.png" alt="YouTube" style="display: inline-block; vertical-align: middle;">
                          </a>
                        </td>
                      </tr>
                    </tbody></table>
                  </td></tr></tbody>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function disclaimerBlock(recipientName = '') {
  return `
    <tr>
      <td style="background: #F7F7F7; padding:25px 8%;">
        <p style="font-size:10px; line-height:18px; font-weight:400; font-family: 'Poppins', sans-serif; color:#747474; text-align: left; margin:0px;">
          <strong style="color: #000000; font-weight: 600;">Disclaimer :</strong> This message contains
          confidential information and is intended only for the individual named. If you are
          not the${recipientName ? ' ' + recipientName : ''} named addressee you should not disseminate,
          distribute or copy this e-mail. You cannot use or forward any attachments in the email.
          Please notify the sender immediately by e-mail if you have received this e-mail by mistake
          and delete this e-mail from your system.
        </p>
      </td>
    </tr>`;
}

function footerBlock() {
  return `
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td height="6px" style="background-color: #4158f9;"></td>
            <td height="6px" style="background-color: #f1b3f3;"></td>
            <td height="6px" style="background-color: #4158f9;"></td>
            <td height="6px" style="background-color: #f1b3f3;"></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; text-align:center; padding:25px 10% 10px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <p style="font-size:12px; line-height:20px; color:#4158F9; font-weight:600; font-family: 'Poppins', sans-serif; margin:0; text-align: center;">
                ${new Date().getFullYear()}, DAGChain &amp; Its Affiliates. All Rights Reserved.
              </p>
              <p style="font-size:12px; line-height:20px; color:#000000; font-weight:600; font-family: 'Poppins', sans-serif; margin:0 0 8px; text-align: center;">
                Powered by
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a href="${BRAND.dagchainUrl}" style="display:inline-block; margin:0px 10px 10px;">
                <img src="${IMG}/logo_dagchain2.png" alt="DAGChain" style="width:100%; max-width:85px; object-fit: contain; display: inline-block;" />
              </a>
              <a href="${BRAND.url}" style="display:inline-block; margin:0px 10px 10px;">
                <img src="${IMG}/logo_dagarmy.png" alt="DAG Army" style="width:100%; max-width:76px; object-fit: contain; display: inline-block;" />
              </a>
              <a href="https://daggpt.network" style="display:inline-block; margin:0px 10px 10px;">
                <img src="${IMG}/logo_daggpt.png" alt="DAGGPT" style="width:100%; max-width:85px; object-fit: contain; display: inline-block;" />
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

// Shared layout wrapper based on DAGChain mailer template
function layout(bannerContent, bodyContent, previewText = '', recipientName = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DAGARMY</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
  ${previewText ? `<span style="display:none;font-size:1px;color:#fff;max-height:0;overflow:hidden;">${previewText}</span>` : ''}
  <style>
    @media (max-width:699px) {
      .mbl_b0 { border: 0 !important; }
      .mbl_fs24 { font-size: 24px !important; line-height: 30px !important; }
      .mbl_fs18 { font-size: 18px !important; line-height: 22px !important; }
      .mbl_ml0 { margin-left: 0 !important; }
      .mbl_pl15 { padding-left: 15px !important; }
      .mbl_pr15 { padding-right: 15px !important; }
    }
  </style>
</head>
<body style="font-family: Poppins, sans-serif; margin: 0; font-size: 14px; background: #f1f1f1; overflow-x: hidden;">
  <div style="background: #fff; width:100%; max-width:700px; margin: 0 auto; font-family: Poppins, sans-serif; border: 2px solid rgba(112, 112, 112, 0.2); overflow: hidden;" class="mbl_b0">
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
      <tbody>
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
              <tbody>
                <!-- Banner -->
                <tr>
                  <td background="${IMG}/bg_banner.png" valign="top" style="background-repeat:no-repeat; background-size:cover; height:417px; background-position:center top; padding-bottom:0px;">
                    <table align="center" valign="top" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="text-align:center; padding:30px 8% 10px;" class="mbl_pl15 mbl_pr15">
                          <a href="${BRAND.url}" style="text-decoration:none;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                              <tr>
                                <td style="vertical-align:middle; padding-right:10px;">
                                  <img src="https://dagarmy.network/images/logo/logo.png" alt="DAGARMY" width="36" height="36" style="display:block; border-radius:6px;" />
                                </td>
                                <td style="vertical-align:middle;">
                                  <span style="font-size:22px; font-weight:700; color:#ffffff; letter-spacing:1px; font-family:'Poppins',sans-serif;">DAGARMY</span>
                                </td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      </tr>
                      ${bannerContent}
                    </table>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td background="${IMG}/bg1.png" style="background-repeat:no-repeat; background-size:auto; background-position:center bottom;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding:5px 8% 10px 8%;" class="mbl_pl15 mbl_pr15">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td>
                                ${bodyContent}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${signatureBlock()}
                ${disclaimerBlock(recipientName)}
                ${footerBlock()}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

/**
 * Welcome email for new student sign-ups
 */
export function welcomeEmailTemplate(userName = 'there') {
  const bannerContent = `
    <tr>
      <td style="padding:0 8% 5px;" class="mbl_pl15 mbl_pr15">
        <h2 class="mbl_fs24" style="font-size: 32px; line-height:45px; color: #ffffff; font-weight: 400; letter-spacing: -0.64px; text-shadow: rgba(241,179,243,0.8) 2px 2px 0px; text-align: center; margin:0 0 5px;">
          An Exciting Journey
        </h2>
        <h3 class="mbl_fs18" style="font-size:20px; line-height:22px; color: #ffffff; font-weight: 600; letter-spacing: -0.4px; font-family: 'Poppins', sans-serif; text-align: center; margin:0 0 30px;">
          AWAITS YOU
        </h3>
      </td>
    </tr>
    <tr>
      <td style="padding:50px 8% 40px; text-align: left;" class="mbl_pl15 mbl_pr15">
        <img src="${IMG}/img_banner.png" alt="Welcome" style="width:100%; max-width:273px; object-fit: contain; display: inline-block; margin:0 0 0 70px;" class="mbl_ml0" />
      </td>
    </tr>`;

  const bodyContent = `
    <p class="mbl_fs24" style="font-size:30px; line-height:40px; font-weight:700; font-family:'Outfit', sans-serif; color:#0022FD; margin:0 0 15px;">
      Dear ${userName},
    </p>
    <p style="font-size:14px; line-height:25px; font-weight:400; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 25px;">
      Welcome to <strong>DAGARMY</strong> - the Global Army of Vibe Coders! We're thrilled to have you join the <strong>DAGChain</strong> ecosystem.
    </p>
    <p style="font-size:14px; line-height:25px; font-weight:400; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 25px;">
      You've just taken the first step towards mastering cutting-edge technologies like <strong>AI, Blockchain, and Data Visualization</strong>. Our platform is designed to help you learn, build, and grow alongside a global community of learners and creators.
    </p>
    <p style="font-size:14px; line-height:25px; font-weight:400; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 10px;">
      <strong>Here's how to get started:</strong>
    </p>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 25px;">
      <tr>
        <td style="padding:8px 0; font-size:14px; line-height:25px; font-family:'Poppins',sans-serif; color:#000000;">
          <strong style="color:#4158f9;">1.</strong> Complete your profile to personalize your learning experience
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-size:14px; line-height:25px; font-family:'Poppins',sans-serif; color:#000000;">
          <strong style="color:#4158f9;">2.</strong> Browse our courses across AI, Blockchain, and Data Visualization
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-size:14px; line-height:25px; font-family:'Poppins',sans-serif; color:#000000;">
          <strong style="color:#4158f9;">3.</strong> Join a program and start your first lesson
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-size:14px; line-height:25px; font-family:'Poppins',sans-serif; color:#000000;">
          <strong style="color:#4158f9;">4.</strong> Earn DAG points as you learn and climb the leaderboard
        </td>
      </tr>
    </table>
    <p style="font-size:14px; line-height:25px; font-weight:400; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 25px;">
      We're excited to have you on board and can't wait to see what you'll achieve. If you ever need help, our support team is just an email away.
    </p>
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:10px 0 25px;">
      <tr>
        <td align="center">
          <a href="${BRAND.url}" style="background-color:#4158f9; border-radius:8px; color:#fff; font-size:16px; font-weight:600; font-family:'Poppins',sans-serif; text-decoration:none; display:inline-block; padding:14px 40px;">
            Explore DAGARMY
          </a>
        </td>
      </tr>
    </table>`;

  return layout(bannerContent, bodyContent, 'Welcome to DAGARMY - Master AI, Blockchain & Data Visualization', userName);
}

/**
 * Generic announcement / custom email from admin or trainer
 */
export function announcementEmailTemplate({ title, body, ctaText, ctaUrl, senderName, recipientName }) {
  const bannerContent = `
    <tr>
      <td style="padding:0 8% 5px;" class="mbl_pl15 mbl_pr15">
        <h2 class="mbl_fs24" style="font-size: 32px; line-height:45px; color: #ffffff; font-weight: 400; letter-spacing: -0.64px; text-shadow: rgba(241,179,243,0.8) 2px 2px 0px; text-align: center; margin:0 0 5px;">
          ${title}
        </h2>
      </td>
    </tr>
    <tr>
      <td style="padding:50px 8% 40px; text-align: left;" class="mbl_pl15 mbl_pr15">
        <img src="${IMG}/img_banner.png" alt="${title}" style="width:100%; max-width:273px; object-fit: contain; display: inline-block; margin:0 0 0 70px;" class="mbl_ml0" />
      </td>
    </tr>`;

  const bodyContent = `
    <p class="mbl_fs24" style="font-size:30px; line-height:40px; font-weight:700; font-family:'Outfit', sans-serif; color:#0022FD; margin:0 0 15px;">
      Dear ${recipientName || 'Member'},
    </p>
    ${senderName ? `<p style="font-size:12px; line-height:20px; font-weight:500; font-family:'Poppins',sans-serif; color:#747474; margin:0 0 15px;">From: <strong style="color:#000;">${senderName}</strong></p>` : ''}
    <div style="font-size:14px; line-height:25px; font-weight:400; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 25px;">
      ${body}
    </div>
    ${ctaText && ctaUrl ? `
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:10px 0 25px;">
      <tr>
        <td align="center">
          <a href="${ctaUrl}" style="background-color:#4158f9; border-radius:8px; color:#fff; font-size:16px; font-weight:600; font-family:'Poppins',sans-serif; text-decoration:none; display:inline-block; padding:14px 40px;">
            ${ctaText}
          </a>
        </td>
      </tr>
    </table>` : ''}`;

  return layout(bannerContent, bodyContent, title, recipientName);
}

/**
 * Course enrollment confirmation email
 */
export function courseEnrollmentEmailTemplate({ userName, courseName, startDate }) {
  const bannerContent = `
    <tr>
      <td style="padding:0 8% 5px;" class="mbl_pl15 mbl_pr15">
        <h2 class="mbl_fs24" style="font-size: 32px; line-height:45px; color: #ffffff; font-weight: 400; letter-spacing: -0.64px; text-shadow: rgba(241,179,243,0.8) 2px 2px 0px; text-align: center; margin:0 0 5px;">
          You're Enrolled!
        </h2>
        <h3 class="mbl_fs18" style="font-size:20px; line-height:22px; color: #ffffff; font-weight: 600; letter-spacing: -0.4px; font-family: 'Poppins', sans-serif; text-align: center; margin:0 0 30px;">
          ${courseName}
        </h3>
      </td>
    </tr>
    <tr>
      <td style="padding:50px 8% 40px; text-align: left;" class="mbl_pl15 mbl_pr15">
        <img src="${IMG}/img_banner.png" alt="Enrolled" style="width:100%; max-width:273px; object-fit: contain; display: inline-block; margin:0 0 0 70px;" class="mbl_ml0" />
      </td>
    </tr>`;

  const bodyContent = `
    <p class="mbl_fs24" style="font-size:30px; line-height:40px; font-weight:700; font-family:'Outfit', sans-serif; color:#0022FD; margin:0 0 15px;">
      Dear ${userName},
    </p>
    <p style="font-size:14px; line-height:25px; font-weight:400; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 25px;">
      Congratulations on enrolling in <strong>${courseName}</strong>!
      ${startDate ? `The course starts on <strong>${startDate}</strong>.` : 'You can start learning right away.'}
    </p>
    <p style="font-size:14px; line-height:25px; font-weight:400; font-family: 'Poppins', sans-serif; color:#000000; margin:0 0 25px;">
      We're excited to have you on board. Head to your dashboard to get started with the course materials.
    </p>
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:10px 0 25px;">
      <tr>
        <td align="center">
          <a href="${BRAND.url}" style="background-color:#4158f9; border-radius:8px; color:#fff; font-size:16px; font-weight:600; font-family:'Poppins',sans-serif; text-decoration:none; display:inline-block; padding:14px 40px;">
            Go to Dashboard
          </a>
        </td>
      </tr>
    </table>`;

  return layout(bannerContent, bodyContent, `You're enrolled in ${courseName}`, userName);
}
