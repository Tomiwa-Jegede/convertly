import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

// ─── Format a USD base price into the active currency ─────────────────────────
export function formatPrice(amountUSD, currency, symbol, rate) {
  const converted = amountUSD * rate;

  // Currencies that are typically shown without decimals
  const noDecimals = ["NGN", "KES", "GHS"];
  const decimals = noDecimals.includes(currency) ? 0 : 2;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(converted);

  return `${symbol}${formatted}`;
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(true);

  // On mount: detect from IP, but let sessionStorage override (manual switch persists per session)
  useEffect(() => {
    const saved = sessionStorage.getItem("preferredCurrency");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrencyState(parsed.currency);
        setSymbol(parsed.symbol);
        setRate(parsed.rate);
        setLoading(false);
        return;
      } catch {
        sessionStorage.removeItem("preferredCurrency");
      }
    }

    // Auto-detect
    fetch(`${API_URL}/api/currency/detect`)
      .then((r) => r.json())
      .then((data) => {
        setCurrencyState(data.currency);
        setSymbol(data.symbol);
        setRate(data.rate);
      })
      .catch(() => {
        // Silently fall back to USD defaults already set
      })
      .finally(() => setLoading(false));
  }, []);

  // Manual switch — user explicitly picks a currency
  function setCurrency({ currency, symbol, rate }) {
    setCurrencyState(currency);
    setSymbol(symbol);
    setRate(rate);
    sessionStorage.setItem(
      "preferredCurrency",
      JSON.stringify({ currency, symbol, rate }),
    );
  }

  return (
    <CurrencyContext.Provider
      value={{ currency, symbol, rate, loading, setCurrency, formatPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
