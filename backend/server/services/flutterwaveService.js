const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const FLW_BASE = "https://api.flutterwave.com/v3";

console.log("FLW_SECRET_KEY exists:", !!process.env.FLW_SECRET_KEY);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// ─── Slugify helper ───────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Create Flutterwave Standard Payment Link ─────────────────────────────────
async function createFlutterwavePaymentLink({
  productName,
  customerName,
  customerEmail,
  customerPhone,
  amount,
}) {
  const txRef = `CONV-${slugify(productName)}-${uuidv4()}`;

  const payload = {
    tx_ref: txRef,
    amount: amount,
    currency: "NGN",
    redirect_url: `${process.env.FRONTEND_URL}/success`,
    meta: {
      product_name: productName,
      customer_email: customerEmail,
      customer_name: customerName,
      tx_ref: txRef,
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

  console.log("FLW Payload:", JSON.stringify(payload, null, 2));

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

// ─── Verify Transaction via Flutterwave API ───────────────────────────────────
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
