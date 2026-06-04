const { readJSON, writeJSON } = require("../utils/jsonStore");
const { appendOnboarding } = require("../services/sheetsService");

// ─── Input sanitiser ──────────────────────────────────────────────────────────
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>"'`]/g, "");
}

// ─── GET /api/onboarding/verify?token= ────────────────────────────────────────
async function verifyToken(req, res, next) {
  try {
    const token = sanitize(req.query.token || "");
    if (!token) {
      return res
        .status(400)
        .json({ valid: false, error: "Token is required." });
    }

    const customers = await readJSON("customers.json");
    const customer = customers.find((c) => c.token === token);

    if (!customer) {
      return res.status(200).json({ valid: false });
    }

    if (!customer.paid) {
      return res.status(200).json({ valid: false });
    }

    return res.status(200).json({ valid: true });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/onboarding/submit ─────────────────────────────────────────────
async function submitOnboarding(req, res, next) {
  try {
    const token = sanitize(req.body.token || "");
    const fullName = sanitize(req.body.fullName || "");
    const businessName = sanitize(req.body.businessName || "");
    const email = sanitize(req.body.email || "");
    const phone = sanitize(req.body.phone || "");
    const goals = sanitize(req.body.goals || "");
    const currentProblems = sanitize(req.body.currentProblems || "");
    const additionalNotes = sanitize(req.body.additionalNotes || "");

    // Validate required fields
    if (!token) {
      return res
        .status(400)
        .json({ success: false, error: "Token is required." });
    }
    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "fullName, email, and phone are required.",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email address." });
    }

    // 1. Load customers and find by token
    const customers = await readJSON("customers.json");
    const customerIndex = customers.findIndex((c) => c.token === token);

    if (customerIndex === -1) {
      return res.status(403).json({ success: false, error: "Invalid token." });
    }

    const customer = customers[customerIndex];

    // 2. Ensure token belongs to a paid customer
    if (!customer.paid) {
      return res.status(403).json({
        success: false,
        error: "Payment not confirmed. Onboarding not available.",
      });
    }

    // 3. Prevent duplicate submissions
    if (customer.onboardingSubmitted) {
      return res.status(409).json({
        success: false,
        error: "Onboarding form has already been submitted for this token.",
      });
    }

    const timestamp = new Date().toISOString();

    // 4. Save onboarding data to customer record
    customers[customerIndex] = {
      ...customer,
      onboardingSubmitted: true,
      onboardingData: {
        fullName,
        businessName,
        email,
        phone,
        goals,
        currentProblems,
        additionalNotes,
        submittedAt: timestamp,
      },
    };
    await writeJSON("customers.json", customers);

    // 5. Append to Google Sheets (onboarding tab)
    await appendOnboarding({
      timestamp,
      customerName: fullName,
      customerEmail: email,
      phone,
      businessName,
      goals,
      currentProblems,
      additionalNotes,
    });

    console.log(`[ONBOARDING] ✅ Submitted for ${email}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { verifyToken, submitOnboarding };
