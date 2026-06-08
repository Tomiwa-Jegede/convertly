const { google } = require("googleapis");

// ─────────────────────────────
// CONFIG
// ─────────────────────────────
const PURCHASE_SHEET = "Purchases";
const ONBOARDING_SHEET = "Onboarding";

// ─────────────────────────────
// AUTH
// ─────────────────────────────
function getAuthClient() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n",
  );

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheets() {
  const auth = await getAuthClient();
  return google.sheets({ version: "v4", auth });
}

// ─────────────────────────────
// APPEND PURCHASE (FIXED + SAFE)
// ─────────────────────────────
async function appendPurchase(data) {
  try {
    const sheets = await getSheets();

    console.log("🔥 SHEETS WRITE ATTEMPT:", data);

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${PURCHASE_SHEET}!A:K`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            data.timestamp,
            data.paymentStatus,
            data.transactionId,
            data.txRef,
            data.customerName,
            data.customerEmail,
            data.customerPhone,
            data.product,
            data.amount,
            data.token,
            data.folderId || "",
          ],
        ],
      },
    });

    console.log("✅ SHEETS WRITE SUCCESS");
    return res.data;
  } catch (err) {
    console.error("❌ SHEETS WRITE FAILED:");
    console.error(err.response?.data || err);
    throw err;
  }
}

// ─────────────────────────────
// APPEND ONBOARDING
// ─────────────────────────────
async function appendOnboarding(data) {
  try {
    const sheets = await getSheets();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${ONBOARDING_SHEET}!A:Z`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            data.timestamp,
            data.customerName,
            data.customerEmail,
            data.phone,
            data.businessName,
            data.goals,
            data.currentProblems,
            data.additionalNotes,
            data.product,
            data.folderId,
            data.folderName,
            data.folderUrl,
          ],
        ],
      },
    });

    console.log("✅ ONBOARDING SAVED");
  } catch (err) {
    console.error("❌ ONBOARDING FAILED:", err.response?.data || err);
  }
}

// ─────────────────────────────
// GET CUSTOMER BY TOKEN
// ─────────────────────────────
async function getCustomerByToken(token) {
  const sheets = await getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${PURCHASE_SHEET}!A:K`,
  });

  const rows = res.data.values || [];

  const row = rows.find((r) => r[9] === token);
  if (!row) return null;

  return {
    timestamp: row[0],
    paymentStatus: row[1],
    transactionId: row[2],
    txRef: row[3],
    customerName: row[4],
    customerEmail: row[5],
    customerPhone: row[6],
    product: row[7],
    amount: row[8],
    token: row[9],
    folderId: row[10],
  };
}

// ─────────────────────────────
// UPDATE PAYMENT STATUS (FIXED)
// ─────────────────────────────
async function updatePaymentStatus(token, status) {
  const sheets = await getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${PURCHASE_SHEET}!A:K`,
  });

  const rows = res.data.values || [];

  const index = rows.findIndex((r) => r[9] === token);

  if (index === -1) {
    console.log("⚠️ Token not found:", token);
    return;
  }

  rows[index][1] = status;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${PURCHASE_SHEET}!A:K`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows,
    },
  });

  console.log("💰 PAYMENT STATUS UPDATED:", token);
}

module.exports = {
  appendPurchase,
  appendOnboarding,
  getCustomerByToken,
  updatePaymentStatus,
};
