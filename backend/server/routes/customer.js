const express = require("express");
const router = express.Router();

const { readJSON } = require("../utils/jsonStore");

router.get("/customer/:token", async (req, res) => {
  try {
    const customers = await readJSON("customers.json");

    const customer = customers.find((c) => c.token === req.params.token);

    if (!customer) {
      return res.status(404).json({
        error: "Invalid token",
      });
    }

    res.json(customer);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
