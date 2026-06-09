const {
  createFlutterwavePaymentLink,
  verifyTransaction,
} = require("../services/flutterwaveService");

const { appendPurchase } = require("../services/sheetsService");
const { sendOnboardingEmail } = require("../services/emailService");
const { generateToken } = require("../utils/generateToken");
const { readJSON, writeJSON } = require("../utils/jsonStore");

// PRODUCTS
const PRODUCTS = {
  "Conversion Websites for Listings": 100,
  "AI Customer Response Bots": 399.99,
  "Booking System Integration": 199.99,
  "Lead Tracking Dashboards": 299.99,
  "Social Media Lead Automation": 299.99,
  "Data & Inquiry Management": 199.99,
  "Full Bundle Package": 1499.99,
};

// CREATE PAYMENT LINK
async function createPaymentLink(req, res, next) {
  try {
    const { productName, customerName, customerEmail, customerPhone } =
      req.body;

    const amount = PRODUCTS[productName];

    if (!amount) {
      return res.status(400).json({ error: "Unknown product" });
    }

    const txRef = `CONV-${Date.now()}`;

    const paymentLink = await createFlutterwavePaymentLink({
      productName,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      txRef,
    });

    return res.json({ paymentLink, txRef });
  } catch (err) {
    console.error("❌ createPaymentLink error:", err);
    next(err);
  }
}

// WEBHOOK
async function handleWebhook(req, res) {
  try {
    const payload = req.body?.toString?.()
      ? JSON.parse(req.body.toString())
      : req.body;

    const event = payload?.event;
    const data = payload?.data;

    if (!event || !data) {
      return res.status(200).json({ received: true });
    }

    if (event !== "charge.completed") {
      return res.status(200).json({ received: true });
    }

    if (data.status !== "successful") {
      return res.status(200).json({ received: true });
    }

    const transactionId = String(data.id);
    const txRef = data.tx_ref;

    const verified = await verifyTransaction(transactionId);
    const result = verified;

    if (!result || result.status !== "successful") {
      return res.status(200).json({ received: true });
    }

    const record = {
      transactionId,
      txRef,
      customerName: result.customer?.name || "",
      customerEmail: result.customer?.email || "",
      customerPhone: result.customer?.phone_number || "",
      amount: result.amount,
      product: result.meta?.product_name || "",
      token: generateToken(),
      paymentStatus: "successful",
      timestamp: new Date().toISOString(),
      folderId: "",
    };

    await appendPurchase(record);
    await sendOnboardingEmail({
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      token: record.token,
    });

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(200).json({ received: true });
  }
}

// VERIFY PAYMENT
async function verifyPayment(req, res) {
  try {
    const { transaction_id } = req.params;

    const response = await verifyTransaction(transaction_id);

    const data = response; // FIX: no nested .data.data

    if (!data || data.status !== "successful") {
      return res.json({ success: false, paid: false });
    }

    return res.json({
      success: true,
      paid: true,
      status: data.status,
      amount: data.amount,
      tx_ref: data.tx_ref,
    });
  } catch (err) {
    return res.json({ success: false, paid: false, error: err.message });
  }
}

module.exports = {
  createPaymentLink,
  handleWebhook,
  verifyPayment,
};
