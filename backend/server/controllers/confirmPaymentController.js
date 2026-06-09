const {
  createFlutterwavePaymentLink,
} = require("../services/flutterwaveService");

const PRODUCTS = {
  "Conversion Websites for Listings": 100,
  "AI Customer Response Bots": 399.99,
  "Booking System Integration": 199.99,
  "Lead Tracking Dashboards": 299.99,
  "Social Media Lead Automation": 299.99,
  "Data & Inquiry Management": 199.99,
  "Full Bundle Package": 1499.99,
};

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim();
}

async function createPaymentLink(req, res) {
  try {
    const { productName, customerName, customerEmail, customerPhone } =
      req.body;

    if (!productName || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: "Missing fields" });
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

    return res.json({
      paymentLink,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { createPaymentLink };
