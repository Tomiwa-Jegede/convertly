const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendOnboardingEmail({ customerName, customerEmail, token }) {
  const TRACE_ID = `ONBOARD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  console.log("\n==============================");
  console.log("📨 [sendOnboardingEmail] CALLED");
  console.log("🧪 TRACE_ID:", TRACE_ID);
  console.log("==============================\n");

  console.log("📦 Input payload:", {
    customerName,
    customerEmail,
    token,
  });

  const FRONTEND_URL = process.env.FRONTEND_URL;

  console.log("🌍 ENV CHECK:", {
    FRONTEND_URL,
    GMAIL_USER_EXISTS: !!process.env.GMAIL_USER,
    GMAIL_PASS_EXISTS: !!process.env.GMAIL_PASS,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!customerEmail || !customerName || !token) {
    throw new Error("Missing required email parameters");
  }

  if (!FRONTEND_URL) {
    throw new Error("FRONTEND_URL not set");
  }

  const onboardingUrl = `${FRONTEND_URL}/onboarding?token=${token}`;

  console.log("🔗 ONBOARDING URL:", onboardingUrl);

  const mailOptions = {
    from: `"Convertly" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: `[${TRACE_ID}] Welcome to Convertly — Complete Your Onboarding`,
    html: `
      <h2>🎉 Welcome to Convertly</h2>

      <p>TRACE: <strong>${TRACE_ID}</strong></p>

      <p>Hi <strong>${customerName}</strong>,</p>

      <p>Complete your onboarding here:</p>

      <p><a href="${onboardingUrl}">${onboardingUrl}</a></p>
    `,
  };

  try {
    console.log("🚀 Sending email via Gmail...");

    const info = await transporter.sendMail(mailOptions);

    console.log("📬 EMAIL SENT SUCCESSFULLY");
    console.log("🆔 Message ID:", info.messageId);
    console.log("🧪 TRACE COMPLETED:", TRACE_ID);

    return info;
  } catch (error) {
    console.log("🔥 EMAIL SEND FAILED");
    console.log("❌ ERROR:", error.message);
    throw error;
  }
}

module.exports = { sendOnboardingEmail };
