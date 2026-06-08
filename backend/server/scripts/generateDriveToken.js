const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

// Put oauth.json in SAME folder as this script
const CREDENTIALS_PATH = path.join(__dirname, "oauth.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

async function authorize() {
  const content = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
  const credentials = JSON.parse(content);

  const { client_id, client_secret, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive"],
  });

  console.log("\nOPEN THIS URL:\n");
  console.log(authUrl);

  process.stdin.resume();
  process.stdout.write("\nPaste Code Here: ");

  process.stdin.on("data", async (data) => {
    const code = data.toString().trim();

    const { tokens } = await oAuth2Client.getToken(code);

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log("\n✅ token.json created");
    process.exit();
  });
}

authorize();
