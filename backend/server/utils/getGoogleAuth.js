const { google } = require("googleapis");

function safeParse(json, name) {
  try {
    return JSON.parse(json);
  } catch {
    throw new Error(`Invalid JSON in ${name}`);
  }
}

function getGoogleAuth() {
  const clientEnv = process.env.GOOGLE_OAUTH_CLIENT;
  const tokenEnv = process.env.GOOGLE_TOKEN;

  if (!clientEnv || !tokenEnv) {
    throw new Error("Missing Google OAuth environment variables");
  }

  const credentials = safeParse(clientEnv, "GOOGLE_OAUTH_CLIENT");
  const token = safeParse(tokenEnv, "GOOGLE_TOKEN");

  const { client_id, client_secret, redirect_uris } = credentials;

  if (!client_id || !client_secret || !redirect_uris?.length) {
    throw new Error("Invalid Google OAuth client structure");
  }

  const auth = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  auth.setCredentials(token);

  return auth;
}

module.exports = getGoogleAuth;
