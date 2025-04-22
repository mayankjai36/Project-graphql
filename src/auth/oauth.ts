import { google } from 'googleapis';
import fs from 'fs';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_SCOPE,
} from '../config/constants';

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_SCOPE,
  });
}

export async function handleOAuthCallback(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync('tokens.json', JSON.stringify(tokens));
}

export function loadClient() {
  const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
  oauth2Client.setCredentials(tokens);
  return google.webmasters({ version: 'v3', auth: oauth2Client });
}
