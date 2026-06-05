const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOnboardingEmail({ customerName, customerEmail, token }) {
  const onboardingUrl = `${process.env.FRONTEND_URL}/onboarding?token=${token}`;

  console.log("📧 Sending email via Resend...");

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: "Welcome to Convertly — Complete Your Onboarding",
    html: `
      <h2>🎉 Welcome to Convertly — Let's Get Your Project Started</h2>

      <p>Hi <strong>${customerName}</strong>,</p>

      <p>Thank you for your purchase.</p>

      <p>
        Complete your onboarding form:
      </p>

      <p>
        <a href="${onboardingUrl}">
          Complete My Onboarding Form
        </a>
      </p>

      <p>
        ${onboardingUrl}
      </p>
    `,
  });

  console.log("✅ Resend response:", result);

  return result;
}

module.exports = { sendOnboardingEmail };
