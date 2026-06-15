const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const FLW_BASE = "https://api.flutterwave.com/v3";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createFlutterwavePaymentLink({
  productName,
  customerName,
  customerEmail,
  customerPhone,
  amount,
  currency = "USD", // ← NEW: was hardcoded, now a parameter
  txRef,
}) {
  const ref = txRef || `CONV-${slugify(productName)}-${uuidv4()}`;

  const payload = {
    tx_ref: ref,
    amount: amount,
    currency: currency, // ← NEW: dynamic
    redirect_url: `${process.env.FRONTEND_URL}/success`,
    meta: {
      product_name: productName,
      customer_email: customerEmail,
      customer_name: customerName,
      tx_ref: ref,
    },
    customer: {
      email: customerEmail,
      name: customerName,
      phone_number: customerPhone,
    },
    customizations: {
      title: "Convertly",
      description: productName,
      logo: `${process.env.FRONTEND_URL}/logo.png`,
    },
    payment_options: "card,banktransfer,ussd",
  };

  const response = await axios.post(`${FLW_BASE}/payments`, payload, {
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

  if (response.data.status !== "success" || !response.data.data?.link) {
    throw new Error(
      `Flutterwave payment link creation failed: ${response.data.message || "Unknown error"}`,
    );
  }

  return response.data.data.link;
}

async function verifyTransaction(transactionId) {
  const response = await axios.get(
    `${FLW_BASE}/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    },
  );

  if (response.data.status !== "success") {
    throw new Error(
      `Flutterwave verification failed: ${response.data.message || "Unknown error"}`,
    );
  }

  return response.data.data;
}

module.exports = { createFlutterwavePaymentLink, verifyTransaction };
