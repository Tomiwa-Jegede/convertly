const nodemailer = require("nodemailer");

// ─── Transporter (Gmail + App Password) ──────────────────────────────────────
let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }
  return transporter;
}

// ─── Send Onboarding Email ────────────────────────────────────────────────────
async function sendOnboardingEmail({ customerName, customerEmail, token }) {
  const onboardingUrl = `${process.env.FRONTEND_URL}/onboarding?token=${token}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Convertly</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #1a1a2e; color: #ffffff; padding: 32px 40px; }
    .header h1 { margin: 0; font-size: 26px; }
    .body { padding: 32px 40px; color: #333333; line-height: 1.6; }
    .body p { margin: 0 0 16px; }
    .cta { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #e94560; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; }
    .footer { padding: 24px 40px; background: #f9f9f9; font-size: 13px; color: #888888; border-top: 1px solid #eeeeee; }
    .url-fallback { word-break: break-all; color: #555; font-size: 13px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Convertly 🎉</h1>
    </div>
    <div class="body">
      <p>Hi <strong>${customerName}</strong>,</p>
      <p>Thank you for your purchase! We're excited to have you on board.</p>
      <p>To get started, please complete your onboarding form so we can tailor our services to your specific needs and goals.</p>
      <a class="cta" href="${onboardingUrl}">Complete My Onboarding Form</a>
      <p>If the button above doesn't work, copy and paste this link into your browser:</p>
      <p class="url-fallback">${onboardingUrl}</p>
      <p>This link is unique to your account. Please do not share it.</p>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>— The Convertly Team</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Convertly. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();

  const textBody = `
Hi ${customerName},

Thank you for your purchase at Convertly!

Please complete your onboarding form here:
${onboardingUrl}

This link is unique to your account. Do not share it.

— The Convertly Team
  `.trim();

  const info = await getTransporter().sendMail({
    from: `"Convertly" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: "Welcome to Convertly — Complete Your Onboarding",
    text: textBody,
    html: htmlBody,
  });

  console.log(
    `[EMAIL] ✅ Onboarding email sent to ${customerEmail} — Message ID: ${info.messageId}`,
  );
  return info;
}

module.exports = { sendOnboardingEmail };
