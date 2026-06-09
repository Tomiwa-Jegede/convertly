const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
function getAuthFromEnv() {
  if (!process.env.GOOGLE_OAUTH_CLIENT || !process.env.GOOGLE_TOKEN) {
    throw new Error("Missing Google OAuth env vars");
  }

  const credentials = JSON.parse(process.env.GOOGLE_OAUTH_CLIENT);
  const token = JSON.parse(process.env.GOOGLE_TOKEN);

  const { client_id, client_secret, redirect_uris } = credentials.installed;

  const auth = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  auth.setCredentials(token);

  return auth;
}

function getDrive() {
  return google.drive({
    version: "v3",
    auth: getAuthFromEnv(),
  });
}

async function createClientFolder(customerName, token) {
  const drive = getDrive();

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

const { Readable } = require("stream");

async function uploadFile(folderId, fileBuffer, fileName) {
  const drive = getDrive();

  try {
    const file = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        body: Readable.from(fileBuffer),
      },
      fields: "id,name,webViewLink",
    });

    console.log("✅ DRIVE UPLOAD SUCCESS:", file.data);

    return file.data;
  } catch (err) {
    console.error("❌ DRIVE UPLOAD FAILED:");
    console.error(err.response?.data || err.message || err);
    throw err;
  }
}

module.exports = {
  createClientFolder,
  uploadFile,
};
