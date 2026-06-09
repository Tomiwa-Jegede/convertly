const express = require("express");
const router = express.Router();

const { google } = require("googleapis");

// ─── Google Sheets Auth ─────────────────────────────────────────────
function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY
        ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(
            /\r/g,
            "",
          )
        : undefined,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

async function getSheets() {
  const auth = await getAuth();
  return google.sheets({ version: "v4", auth });
}

// ─── GET /api/customer/:token ───────────────────────────────────────
router.get("/customer/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const sheets = await getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Purchases!A:K",
    });

    const rows = response.data.values || [];

    // OPTIONAL: skip header row if exists
    const dataRows = rows.slice(1);

    // find matching customer by token (column index must match your sheet)
    const customerRow = dataRows.find((row) => row[9] === token);
    // 👆 token column assumed index 9 (adjust if different)

    if (!customerRow) {
      return res.status(404).json({
        error: "Invalid token",
      });
    }

    const customer = {
      timestamp: customerRow[0],
      paymentStatus: customerRow[1],
      transactionId: customerRow[2],
      txRef: customerRow[3],
      customerName: customerRow[4],
      customerEmail: customerRow[5],
      customerPhone: customerRow[6],
      product: customerRow[7],
      amount: customerRow[8],
      token: customerRow[9],
      folderId: customerRow[10],
    };

    return res.json(customer);
  } catch (err) {
    console.error("❌ GOOGLE SHEETS CUSTOMER FETCH ERROR:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
