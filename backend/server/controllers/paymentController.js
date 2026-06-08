const {
  createFlutterwavePaymentLink,
  verifyTransaction,
} = require("../services/flutterwaveService");

const { appendPurchase } = require("../services/sheetsService");
const { sendOnboardingEmail } = require("../services/emailService");
const { generateToken } = require("../utils/generateToken");
const { readJSON, writeJSON } = require("../utils/jsonStore");

// ─── PRODUCT CATALOGUE ─────────────────────────────────────────────
const PRODUCTS = {
  "Conversion Websites for Listings": 100,
  "AI Customer Response Bots": 399.99,
  "Booking System Integration": 199.99,
  "Lead Tracking Dashboards": 299.99,
  "Social Media Lead Automation": 299.99,
  "Data & Inquiry Management": 199.99,
  "Full Bundle Package": 1499.99,
};

// ─── HELPERS ───────────────────────────────────────────────────────
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>"'`]/g, "");
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ───────────────────────────────────────────────────────────────────
// CREATE PAYMENT LINK
// ───────────────────────────────────────────────────────────────────
async function createPaymentLink(req, res, next) {
  try {
    const productName = sanitize(req.body.productName);
    const customerName = sanitize(req.body.customerName);
    const customerEmail = sanitize(req.body.customerEmail);
    const customerPhone = sanitize(req.body.customerPhone);

    if (!productName || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        error:
          "productName, customerName, customerEmail and customerPhone are required.",
      });
    }

    const amount = PRODUCTS[productName];
    if (!amount) {
      return res.status(400).json({ error: "Unknown product" });
    }

    const paymentLink = await createFlutterwavePaymentLink({
      productName,
      customerName,
      customerEmail,
      customerPhone,
      amount,
    });

    return res.json({ paymentLink });
  } catch (err) {
    next(err);
  }
}

// ───────────────────────────────────────────────────────────────────
// WEBHOOK HANDLER (FIXED)
// ───────────────────────────────────────────────────────────────────

async function handleWebhook(req, res) {
  console.log("\n🔥🔥 WEBHOOK RECEIVED 🔥🔥");

  try {
    console.log("📦 HEADERS:", req.headers);

    // 1. Verify signature
    const hash = req.headers["verif-hash"];
    console.log("🔐 Webhook Hash:", hash);

    if (!hash || hash !== process.env.FLW_WEBHOOK_HASH) {
      console.log("❌ Invalid webhook hash");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Parse payload safely (FIXED)
    let payload;

    try {
      if (Buffer.isBuffer(req.body)) {
        payload = JSON.parse(req.body.toString("utf8"));
      } else if (typeof req.body === "string") {
        payload = JSON.parse(req.body);
      } else {
        payload = req.body;
      }
    } catch (err) {
      console.log("❌ JSON PARSE ERROR:", err.message);
      return res.status(200).json({ received: true });
    }

    console.log("📦 PARSED PAYLOAD:", JSON.stringify(payload, null, 2));

    const data = payload?.data;

    if (!data) {
      console.log("❌ No data object in payload");
      return res.status(200).json({ received: true });
    }

    console.log("💰 PAYMENT DATA:", data);

    // 3. Only successful payments
    if (payload.event !== "charge.completed" || data.status !== "successful") {
      console.log(
        "⚠️ Ignoring non-successful event:",
        payload.event,
        data.status,
      );
      return res.status(200).json({ received: true });
    }

    const transactionId = String(data.id);
    const txRef = data.tx_ref;

    console.log("🧾 Transaction ID:", transactionId);
    console.log("🔗 TX REF:", txRef);

    // 4. Prevent duplicates
    const processed = await readJSON("processedEvents.json");

    if (processed.includes(transactionId)) {
      console.log("⚠️ Duplicate transaction ignored");
      return res.status(200).json({ received: true });
    }

    // 5. Verify transaction
    console.log("🔍 Verifying transaction...");
    const verified = await verifyTransaction(transactionId);

    console.log("✅ VERIFIED RESPONSE:", verified);

    if (!verified || verified.status !== "successful") {
      console.log("❌ Verification failed");
      return res.status(200).json({ received: true });
    }

    const customerEmail =
      sanitize(verified.meta?.customer_email) ||
      sanitize(verified.customer?.email);

    const customerName =
      sanitize(verified.meta?.customer_name) ||
      sanitize(verified.customer?.name) ||
      "";

    const customerPhone = sanitize(verified.customer?.phone_number || "");
    const amount = verified.amount;
    const currency = verified.currency;
    const product = verified.meta?.product_name || "Unknown Product";

    const token = generateToken();

    console.log("🎟 GENERATED TOKEN:", token);

    // 6. Save to JSON (backup DB)
    const customers = await readJSON("customers.json");

    const record = {
      transactionId,
      txRef,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      currency,
      product,
      token,
      paid: true,
      createdAt: new Date().toISOString(),
    };

    customers.push(record);
    await writeJSON("customers.json", customers);

    processed.push(transactionId);
    await writeJSON("processedEvents.json", processed);

    // 7. SAVE TO GOOGLE SHEETS (IMPORTANT DEBUG STEP)
    console.log("📊 Writing to Google Sheets...");

    await appendPurchase({
      timestamp: record.createdAt,
      paymentStatus: "successful",
      transactionId,
      txRef,
      customerName,
      customerEmail,
      customerPhone,
      product,
      amount,
      token,
      folderId: "",
    });

    console.log("📊 Google Sheets write complete");

    // 8. Email
    console.log("📧 Sending onboarding email...");

    await sendOnboardingEmail({
      customerName,
      customerEmail,
      token,
    });

    console.log("✅ EMAIL SENT");

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("🔥 WEBHOOK CRASH:", err);
    return res.status(200).json({ received: true });
  }
}

// ───────────────────────────────────────────────────────────────────
// VERIFY PAYMENT (FRONTEND)
// ───────────────────────────────────────────────────────────────────
async function verifyPayment(req, res) {
  try {
    const { transaction_id } = req.params;

    const data = await verifyTransaction(transaction_id);

    if (data.status === "successful") {
      return res.json({
        success: true,
        status: data.status,
        amount: data.amount,
        tx_ref: data.tx_ref,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Payment not successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  createPaymentLink,
  handleWebhook,
  verifyPayment,
};
