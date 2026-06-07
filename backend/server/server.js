const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const onboardingRoutes = require("./routes/onboarding");


// IMPORTANT: raw body for webhook
app.use("/api/flutterwave/webhook", express.raw({ type: "application/json" }));

// normal JSON
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(helmet());

// ROUTES
app.use("/api", require("./routes/payment"));
app.use("/api", require("./routes/customer"));
app.use("/api", onboardingRoutes);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

