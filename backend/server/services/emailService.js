const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  return transporter;
}

async function sendOnboardingEmail({ customerName, customerEmail, token }) {
  console.log("📧 EMAIL FUNCTION STARTED");

  console.log("GMAIL_USER:", process.env.GMAIL_USER);
  console.log("GMAIL_PASS exists:", !!process.env.GMAIL_PASS);

  const transporter = getTransporter();

  console.log("🔍 VERIFYING SMTP CONNECTION...");

  await transporter.verify();

  console.log("✅ SMTP VERIFIED");

  const onboardingUrl = `${process.env.FRONTEND_URL}/onboarding?token=${token}`;

  const htmlBody = `
  <h2>Welcome to Convertly 🎉</h2>

  <p>Hi <strong>${customerName}</strong>,</p>

  <p>Thank you for your purchase.</p>

  <p>
    Complete your onboarding form below:
  </p>

  <p>
    <a href="${onboardingUrl}">
      Complete My Onboarding Form
    </a>
  </p>

  <p>
    If the button doesn't work:
    ${onboardingUrl}
  </p>
  `;

  const textBody = `
Hi ${customerName},

Thank you for your purchase.

Complete your onboarding form:

${onboardingUrl}

- Convertly
`;

  console.log("📨 SENDING EMAIL TO:", customerEmail);

  const info = await transporter.sendMail({
    from: `"Convertly" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: "Welcome to Convertly — Complete Your Onboarding",
    text: textBody,
    html: htmlBody,
  });

  console.log("✅ EMAIL SENT");
  console.log("Message ID:", info.messageId);

  return info;
}

module.exports = {
  sendOnboardingEmail,
};
