const crypto = require("crypto");

/**
 * Generates a cryptographically secure, URL-safe onboarding token.
 * 48 bytes → 96 hex characters — effectively unguessable.
 */
function generateToken() {
  return crypto.randomBytes(48).toString("hex");
}

module.exports = { generateToken };
