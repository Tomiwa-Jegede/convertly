const { google } = require("googleapis");

const PURCHASE_SHEET = "Purchases";

function getAuth() {
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY
        ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(
            /\r/g,
            "",
          )
        : undefined,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  
  return auth;
}

async function getSheets() {
 
  const auth = await getAuth();
  return google.sheets({ version: "v4", auth });
}

async function appendPurchase(data) {
  try {
   

    const sheets = await getSheets();
    

    const row = [
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
    ];

    

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${PURCHASE_SHEET}!A:K`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

   

    if (!res.data?.updates) {
      console.warn("⚠️ No updates info in Sheets response:", res.data);
    }

   

   
  } catch (err) {
    console.error("❌ SHEETS ERROR CAUGHT:");
    console.error("MESSAGE:", err.message);
    console.error("FULL ERROR:", err.response?.data || err);
    throw err;
  }
}
async function appendOnboarding(data) {
  const sheets = await getSheets();

  const row = [
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
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `Onboarding!A:L`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}
module.exports = { appendPurchase, appendOnboarding };
