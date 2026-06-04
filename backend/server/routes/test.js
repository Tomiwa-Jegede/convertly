const express = require("express");
const router = express.Router();

const { sendOnboardingEmail } = require("../services/emailService");

router.get("/test-email", async (req, res) => {
  try {
    await sendOnboardingEmail({
      customerName: "Test User",
      customerEmail: process.env.GMAIL_USER,
      token: "TEST123",
    });

    ```
res.send("Email sent successfully");
```;
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
