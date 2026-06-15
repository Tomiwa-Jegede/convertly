const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
console.log("🌍 FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("✅ Allowed origins:", allowedOrigins);

const app = express();
app.set("trust proxy", true); // ← add this

const onboardingRoutes = require("./routes/onboarding");

// IMPORTANT: webhook RAW body MUST come before JSON middleware
app.use("/api/flutterwave/webhook", (req, res, next) => {
  next();
});

app.use("/api/flutterwave/webhook", express.raw({ type: "application/json" }));

// CORS DEBUG
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3001",
  "http://localhost:5173",
].filter(Boolean);

app.use((req, res, next) => {
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(helmet());

app.use((req, res, next) => {
  next();
});

app.use(express.json());

// ROUTES LOADING
app.use("/api", require("./routes/payment"));
app.use("/api", require("./routes/customer"));
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/currency", require("./routes/currency")); // ← NEW

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {});

console.log(`🚀 Server running on port ${PORT}`);
