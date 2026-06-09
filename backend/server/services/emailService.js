const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOnboardingEmail({ customerName, customerEmail, token }) {
  const TRACE_ID = `ONBOARD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  console.log("\n\n==============================");
  console.log("📨 [sendOnboardingEmail] CALLED");
  console.log("🧪 TRACE_ID:", TRACE_ID);
  console.log("==============================\n");

  console.log("📦 Input payload:", { customerName, customerEmail, token });

  const FRONTEND_URL = process.env.FRONTEND_URL;
  const EMAIL_FROM = process.env.EMAIL_FROM;

  console.log("🌍 ENV CHECK:", {
    FRONTEND_URL,
    EMAIL_FROM,
    RESEND_API_KEY_EXISTS: !!process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!customerEmail || !customerName || !token) {
    console.log("❌ INVALID INPUTS");
    console.log({ customerName, customerEmail, token });
    throw new Error("Missing required email parameters");
  }

  if (!FRONTEND_URL) {
    console.log("❌ FRONTEND_URL missing");
    throw new Error("FRONTEND_URL not set");
  }

  if (!EMAIL_FROM) {
    console.log("❌ EMAIL_FROM missing");
    throw new Error("EMAIL_FROM not set");
  }

  const onboardingUrl = `${FRONTEND_URL}/onboarding?token=${token}`;

  console.log("🔗 ONBOARDING URL GENERATED:", onboardingUrl);

  const emailPayload = {
    from: EMAIL_FROM,
    to: customerEmail,
    subject: `[${TRACE_ID}] Welcome to Convertly — Complete Your Onboarding`,
    html: `
      <h2>🎉 Welcome to Convertly</h2>

      <p>TRACE: <strong>${TRACE_ID}</strong></p>

      <p>Hi <strong>${customerName}</strong>,</p>

      <p>Complete onboarding here:</p>

      <p><a href="${onboardingUrl}">${onboardingUrl}</a></p>
    `,
  };

  console.log("📤 EMAIL PAYLOAD READY:", {
    from: emailPayload.from,
    to: emailPayload.to,
    subject: emailPayload.subject,
    htmlSize: emailPayload.html.length,
  });

  try {
    console.log("🚀 [Resend] sending email...");

    const result = await resend.emails.send(emailPayload);

    console.log("📬 [Resend RAW RESPONSE]:", JSON.stringify(result, null, 2));

    if (!result) {
      console.log("❌ NO RESPONSE FROM RESEND");
      return null;
    }

    if (result.error) {
      console.log("❌ RESEND ERROR:");
      console.log(result.error);
      return result;
    }

    if (result.data?.id) {
      console.log("✅ EMAIL SENT SUCCESSFULLY");
      console.log("🆔 EMAIL ID:", result.data.id);
      console.log("🧪 TRACE COMPLETED:", TRACE_ID);
    } else {
      console.log("⚠️ UNKNOWN RESPONSE FORMAT:", result);
    }

    console.log("==============================\n\n");

    return result;
  } catch (error) {
    console.log("🔥 EMAIL SEND FAILED");
    console.log("🧨 TRACE_ID:", TRACE_ID);
    console.log("❌ MESSAGE:", error.message);
    console.log("📛 STACK:", error.stack);

    throw error;
  }
}

module.exports = { sendOnboardingEmail };
