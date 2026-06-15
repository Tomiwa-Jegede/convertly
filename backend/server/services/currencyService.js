const axios = require("axios");

// ─── Supported currencies and their symbols ───────────────────────────────────
const SUPPORTED_CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  NGN: { symbol: "₦", name: "Nigerian Naira" },
  GBP: { symbol: "£", name: "British Pound" },
  EUR: { symbol: "€", name: "Euro" },
  GHS: { symbol: "GH₵", name: "Ghanaian Cedi" },
  KES: { symbol: "KSh", name: "Kenyan Shilling" },
  ZAR: { symbol: "R", name: "South African Rand" },
  CAD: { symbol: "CA$", name: "Canadian Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
};

// ─── Country → Currency map ───────────────────────────────────────────────────
const COUNTRY_CURRENCY_MAP = {
  US: "USD",
  GB: "GBP",
  NG: "NGN",
  GH: "GHS",
  KE: "KES",
  ZA: "ZAR",
  CA: "CAD",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  PT: "EUR",
  AT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
};

// ─── NEW: Cloudflare country → currency helper ────────────────────────────────
function detectCurrencyFromCountry(countryCode) {
  return COUNTRY_CURRENCY_MAP[countryCode] || "USD";
}

// ─── In-memory rate cache ─────────────────────────────────────────────────────
let rateCache = {
  rates: null,
  lastFetched: null,
};

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// ─── Fetch exchange rates (USD as base) ───────────────────────────────────────
async function getExchangeRates() {
  const now = Date.now();

  if (
    rateCache.rates &&
    rateCache.lastFetched &&
    now - rateCache.lastFetched < CACHE_TTL_MS
  ) {
    return rateCache.rates;
  }

  try {
    const response = await axios.get("https://open.er-api.com/v6/latest/USD", {
      timeout: 8000,
    });

    const all = response.data.rates;
    const needed = ["NGN", "GBP", "EUR", "GHS", "KES", "ZAR", "CAD", "AUD"];
    const rates = { USD: 1 };

    needed.forEach((c) => {
      if (all[c]) rates[c] = all[c];
    });

    console.log("✅ [getExchangeRates] Fetched rates:", rates);

    rateCache.rates = rates;
    rateCache.lastFetched = now;
    return rates;
  } catch (err) {
    console.error(
      "⚠️ Exchange rate fetch failed, using fallback rates:",
      err.message,
    );

    const fallback = {
      USD: 1,
      NGN: 1600,
      GBP: 0.79,
      EUR: 0.92,
      GHS: 15.5,
      KES: 129,
      ZAR: 18.6,
      CAD: 1.36,
      AUD: 1.53,
    };

    rateCache.rates = fallback;
    rateCache.lastFetched = now - CACHE_TTL_MS + 30 * 60 * 1000;
    return fallback;
  }
}

// ─── Detect currency from IP (fallback only) ──────────────────────────────────
async function detectCurrencyFromIP(ip) {
  try {
    const cleanIP = ip?.replace("::ffff:", "") || "";
    console.log("🧹 [detectCurrencyFromIP] Clean IP:", cleanIP);

    if (
      !cleanIP ||
      cleanIP === "127.0.0.1" ||
      cleanIP.startsWith("192.168") ||
      cleanIP.startsWith("10.")
    ) {
      console.log("🏠 Local IP detected, defaulting to USD");
      return "USD";
    }

    const geoURL = `https://ipapi.co/${cleanIP}/country/`;
    console.log("📡 Calling geo API:", geoURL);

    const response = await axios.get(geoURL, { timeout: 5000 });

    const countryCode = response.data?.trim();
    console.log("🗺️ Country code:", countryCode);

    return COUNTRY_CURRENCY_MAP[countryCode] || "USD";
  } catch (err) {
    console.error("⚠️ IP detection failed, defaulting to USD:", err.message);
    return "USD";
  }
}

// ─── Pricing helpers ──────────────────────────────────────────────────────────
function applyCharmPricing(amount, currency) {
  const roundTo1000 = ["NGN"];
  const roundTo10 = ["KES", "GHS"];

  if (roundTo1000.includes(currency)) {
    const rounded = Math.ceil(amount / 1000) * 1000;
    return rounded - 100;
  }

  if (roundTo10.includes(currency)) {
    const rounded = Math.ceil(amount / 10) * 10;
    const charmed = rounded - 10;
    return charmed % 100 === 0 ? charmed - 10 : charmed;
  }

  const rounded = Math.ceil(amount);
  return parseFloat((rounded - 0.01).toFixed(2));
}

async function convertFromUSD(amountUSD, targetCurrency) {
  if (targetCurrency === "USD") {
    return applyCharmPricing(amountUSD, "USD");
  }

  const rates = await getExchangeRates();
  const rate = rates[targetCurrency];

  if (!rate) return applyCharmPricing(amountUSD, "USD");

  const converted = amountUSD * rate;
  return applyCharmPricing(converted, targetCurrency);
}

async function getPricingForCurrency(currency) {
  const validCurrency = SUPPORTED_CURRENCIES[currency] ? currency : "USD";
  const rates = await getExchangeRates();
  const rate = rates[validCurrency] || 1;
  const { symbol } = SUPPORTED_CURRENCIES[validCurrency];

  return { currency: validCurrency, symbol, rate };
}

// ─── EXPORTS ───────────────────────────────────────────────────────────────────
module.exports = {
  SUPPORTED_CURRENCIES,
  detectCurrencyFromIP,
  detectCurrencyFromCountry, // ✅ NEW
  convertFromUSD,
  getPricingForCurrency,
  applyCharmPricing,
};
