const express = require("express");
const router = express.Router();

const {
  createPaymentLink,
  handleWebhook,
  verifyPayment,
} = require("../controllers/paymentController");



// create payment link
router.post("/create-payment-link", (req, res, next) => {

  createPaymentLink(req, res, next);
});

// verify payment (frontend)
router.get("/confirm-payment/:transaction_id", (req, res, next) => {

  verifyPayment(req, res, next);
});

// webhook
router.post("/flutterwave/webhook", (req, res, next) => {

  handleWebhook(req, res, next);
});

module.exports = router;
