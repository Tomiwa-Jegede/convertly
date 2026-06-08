const express = require("express");
const router = express.Router();

const {
  createPaymentLink,
  handleWebhook,
  verifyPayment,
} = require("../controllers/paymentController");

const { updatePaymentStatus } = require("../services/sheetsService");

// ─── PAYMENT FLOW ROUTES ─────────────────────────

// create payment link
router.post("/create-payment-link", createPaymentLink);

// verify payment (frontend check)
router.get("/verify-payment/:transaction_id", verifyPayment);

// webhook (Flutterwave server-to-server)
router.post("/flutterwave/webhook", handleWebhook);

// ─── MANUAL CONFIRMATION ROUTE (IMPORTANT FIX) ─────
router.post("/confirm-payment", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    await updatePaymentStatus(token, "paid");

    return res.json({ success: true });
  } catch (err) {
    console.error("[PAYMENT] confirm-payment error:", err);
    return res.status(500).json({ error: "Payment update failed" });
  }
});

module.exports = router;
