const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

const testRoutes = require("./routes/test");

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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS exists:", !!process.env.GMAIL_PASS);