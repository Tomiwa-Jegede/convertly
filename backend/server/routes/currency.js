const express = require("express");
const router = express.Router();
const {
  detectCurrencyFromIP,
  getPricingForCurrency,
  SUPPORTED_CURRENCIES,
} = require("../services/currencyService");

// GET /api/currency/detect
// Detects the visitor's currency from their IP
router.get("/detect", async (req, res) => {
  try {
    console.log(
      "🔍 [currency/detect] All headers:",
      JSON.stringify(req.headers, null, 2),
    );

    const ip =
      req.headers["x-nf-client-connection-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["cf-connecting-ip"] ||
      req.headers["true-client-ip"] ||
      req.socket?.remoteAddress ||
      req.ip ||
      "";

    console.log("🌐 [currency/detect] Resolved IP:", ip);

    const currency = await detectCurrencyFromIP(ip);
    console.log("💱 [currency/detect] Detected currency:", currency);

    const pricing = await getPricingForCurrency(currency);
    console.log("💰 [currency/detect] Final pricing:", pricing);

    return res.json({
      currency: pricing.currency,
      symbol: pricing.symbol,
      rate: pricing.rate,
    });
  } catch (err) {
    console.error("❌ Currency detect error:", err);
    return res.json({ currency: "USD", symbol: "$", rate: 1 });
  }
});

// GET /api/currency/supported
// Returns list of all supported currencies for the manual switcher
router.get("/supported", (req, res) => {
  return res.json({ currencies: SUPPORTED_CURRENCIES });
});

module.exports = router;
