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
    console.log("Customer email from frontend:", customerEmail);
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
  console.log("🔥 WEBHOOK RECEIVED");

  try {
    // ── verify flutterwave signature ──
    const hash = req.headers["verif-hash"];
    if (!hash || hash !== process.env.FLW_WEBHOOK_HASH) {
      console.log("❌ Invalid webhook hash");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ── parse raw body safely ──
    let payload;
    try {
      payload = JSON.parse(req.body.toString("utf8"));
    } catch (err) {
      console.log("❌ Invalid JSON body");
      return res.status(200).json({ received: true });
    }

    console.log("📦 Event:", payload.event);

    const data = payload?.data;
    if (!data) {
      console.log("❌ No data found");
      return res.status(200).json({ received: true });
    }

    // only handle successful payments
    if (payload.event !== "charge.completed" || data.status !== "successful") {
      return res.status(200).json({ received: true });
    }

    const transactionId = String(data.id);
    const txRef = data.tx_ref;

    // ── prevent duplicates ──
    const processed = await readJSON("processedEvents.json");
    if (processed.includes(transactionId)) {
      return res.status(200).json({ received: true });
    }

    // ── verify transaction from flutterwave ──
    const verified = await verifyTransaction(transactionId);

    if (!verified || verified.status !== "successful") {
      return res.status(200).json({ received: true });
    }
    console.log(
      "Verified customer:",
      JSON.stringify(verified.customer, null, 2),
    );
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

    let product = verified.meta?.product_name || "Unknown Product";

    const token = generateToken();

    // ── save customer record ──
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

    const customers = await readJSON("customers.json");
    customers.push(record);
    await writeJSON("customers.json", customers);

    processed.push(transactionId);
    await writeJSON("processedEvents.json", processed);

    // ── save to sheets ──
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
    });

    // ── SEND EMAIL (IMPORTANT PART) ──
    console.log("📧 Sending onboarding email...");

    await sendOnboardingEmail({
      customerName,
      customerEmail,
      token,
    });

    console.log("✅ Email sent successfully");

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("🔥 WEBHOOK ERROR:", err.message);
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
