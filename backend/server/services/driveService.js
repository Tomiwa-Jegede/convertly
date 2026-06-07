const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../credentials/oauth.json")),
);

const token = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../credentials/token.json")),
);

const { client_secret, client_id, redirect_uris } = credentials.installed;

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

auth.setCredentials(token);

const drive = google.drive({
  version: "v3",
  auth,
});

async function createClientFolder(customerName, token) {
  const folder = await drive.files.create({
    requestBody: {
      name: `${customerName}-${token}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER],
    },
    fields: "id,name",
  });

  return folder.data;
}

async function uploadFile(folderId, filePath, fileName) {
  const file = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },

    media: {
      body: fs.createReadStream(filePath),
    },

    fields: "id,name,webViewLink",
  });

  // DELETE LOCAL TEMP FILE AFTER SUCCESSFUL UPLOAD
  try {
    fs.unlinkSync(filePath);
    console.log(`🗑 Deleted local file: ${filePath}`);
  } catch (err) {
    console.error("Failed to delete local file:", err.message);
  }

  return file.data;
}

module.exports = {
  createClientFolder,
  uploadFile,
};
