const { readJSON } = require("../utils/jsonStore");

/**
 * Express middleware that validates an onboarding token from the request body.
 * Attaches the matched customer record to req.customer on success.
 * Use on routes that require a valid paid-customer token.
 */
async function verifyTokenMiddleware(req, res, next) {
  try {
    const token = (req.body.token || "").trim();

    if (!token) {
      return res.status(400).json({ error: "Token is required." });
    }

    const customers = await readJSON("customers.json");
    const customer = customers.find((c) => c.token === token);

    if (!customer) {
      return res.status(403).json({ error: "Invalid token." });
    }

    if (!customer.paid) {
      return res.status(403).json({
        error: "Payment not confirmed. Access denied.",
      });
    }

    // Attach customer to request for downstream handlers
    req.customer = customer;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { verifyTokenMiddleware };
