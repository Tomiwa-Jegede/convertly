const express = require("express");
const router = express.Router();

const {
  createPaymentLink,
  handleWebhook,
  verifyPayment,
} = require("../controllers/paymentController");

// create payment link
router.post("/create-payment-link", createPaymentLink);

// verify payment (frontend check)
router.get("/verify-payment/:transaction_id", verifyPayment);

// webhook (Flutterwave server-to-server)
router.post("/flutterwave/webhook", handleWebhook);


module.exports = router;
