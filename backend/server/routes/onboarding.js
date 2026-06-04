const express = require("express");
const router = express.Router();
const {
  verifyToken,
  submitOnboarding,
} = require("../controllers/onboardingController");

// GET /api/onboarding/verify?token=abc123
router.get("/verify", verifyToken);

// POST /api/onboarding/submit
router.post("/submit", submitOnboarding);

module.exports = router;
