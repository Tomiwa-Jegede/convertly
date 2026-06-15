const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
app.set("trust proxy", true);
const onboardingRoutes = require("./routes/onboarding");

// Define BEFORE any console.log that references it
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3001",
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// 1. Pre-flight first
app.options("*", cors(corsOptions));

// 2. CORS before everything else
app.use(cors(corsOptions));

// 3. Helmet after CORS, with CORP set to cross-origin
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// 4. Webhook raw body (before express.json)
app.use("/api/flutterwave/webhook", express.raw({ type: "application/json" }));

// 5. JSON body parser
app.use(express.json());

// Routes
app.use("/api", require("./routes/payment"));
app.use("/api", require("./routes/customer"));
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/currency", require("./routes/currency"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`); // ✅ now inside the callback
});
