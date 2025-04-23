import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const TOKEN_PATH = path.join(__dirname, 'tokens.json');

async function main() {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  console.log('\n🔗 Open the following URL in your browser:\n');
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\n📥 Paste the code from Google here: ', async (code) => {
    rl.close();

    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log('\n✅ Tokens saved to src/auth/tokens.json');
    } catch (error) {
      console.error('❌ Error retrieving access token:', error);
    }
  });
}

main().catch(console.error);
