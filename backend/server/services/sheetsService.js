const { google } = require("googleapis");

// ─── Sheet Tab Names ─────────────────────────────────────────────────────────
const PURCHASE_SHEET = "Purchases";
const ONBOARDING_SHEET = "Onboarding";

// ─── Auth Client ──────────────────────────────────────────────────────────────
function getAuthClient() {
  // Railway stores the private key with literal \n — normalise them
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n",
  );

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
}

// ─── Append a row helper ──────────────────────────────────────────────────────
async function appendRow(sheetName, values) {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values],
    },
  });
}

// Columns: Timestamp | Payment Status | Transaction ID | Transaction Reference
//          | Customer Name | Customer Email | Phone
//          | Product Purchased | Amount
async function appendPurchase({
  timestamp,
  paymentStatus,
  transactionId,
  txRef,
  customerName,
  customerEmail,
  customerPhone,
  product,
  amount,
}) {
  try {
    await appendRow(PURCHASE_SHEET, [
      timestamp,
      paymentStatus,
      String(transactionId),
      txRef,
      customerName,
      customerEmail,
      customerPhone,
      product,
      amount,
    ]);
    console.log(`[SHEETS] ✅ Purchase appended for ${customerEmail}`);
  } catch (err) {
    console.error("[SHEETS] Full error:", err.response?.data || err);
  }
}

// ─── appendOnboarding ────────────────────────────────────────────────────────
// Columns: Timestamp | Customer Name | Customer Email | Phone
//          | Business Name | Goals | Current Problems | Additional Notes
async function appendOnboarding({
  timestamp,
  customerName,
  customerEmail,
  phone,
  businessName,
  goals,
  currentProblems,
  additionalNotes,
}) {
  try {
    await appendRow(ONBOARDING_SHEET, [
      timestamp,
      customerName,
      customerEmail,
      phone,
      businessName,
      goals,
      currentProblems,
      additionalNotes,
    ]);
    console.log(`[SHEETS] ✅ Onboarding appended for ${customerEmail}`);
  } catch (err) {
    // Non-fatal: log but don't throw — form data is already saved locally
    console.error("[SHEETS] Failed to append onboarding row:", err.message);
  }
}

module.exports = { appendPurchase, appendOnboarding };
