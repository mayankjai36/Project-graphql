import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const CREDENTIALS = {
  client_id: process.env.GOOGLE_CLIENT_ID!,
  client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  redirect_uris: [process.env.GOOGLE_REDIRECT_URI!]
};

const TOKEN_PATH = path.join(__dirname, 'tokens.json');

export function getOAuthClient() {
  const { client_id, client_secret, redirect_uris } = CREDENTIALS;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}
