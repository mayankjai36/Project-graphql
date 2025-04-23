import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import inquirer from 'inquirer';
import { OAuth2Client } from 'google-auth-library';

// Read OAuth credentials from environment
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

// Paths
const tokenPath = path.join(__dirname, 'tokens.json');
const selectedSitePath = path.join(__dirname, 'selectedSite.json');

// Create OAuth client using saved token
function getOAuthClient(): OAuth2Client {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

export async function listAndSaveSiteUrl() {
  console.log('🔁 Fetching site list from Google Search Console...');

  const auth = getOAuthClient();
  const webmasters = google.webmasters({ version: 'v3', auth });

  const res = await webmasters.sites.list();
  const sites = res.data.siteEntry || [];

  if (sites.length === 0) {
    console.error(
      '❌ No sites found. Make sure your OAuth user has verified properties in Search Console.'
    );
    return;
  }

  console.log(`✅ Found ${sites.length} site(s).`);

  const choices = sites.map((site) => ({
    name: site.siteUrl || 'Unknown',
    value: site.siteUrl || '',
  }));

  const { selectedSite }: { selectedSite: string } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedSite',
      message: 'Choose a site:',
      choices: choices as { name: string; value: string }[],
    },
  ]);

  fs.writeFileSync(
    selectedSitePath,
    JSON.stringify({ siteUrl: selectedSite }, null, 2)
  );
  console.log(
    `✅ Selected site URL saved to selectedSite.json:\n${selectedSite}`
  );
}

// If running this file directly
if (require.main === module) {
  listAndSaveSiteUrl().catch((err) => {
    console.error('❌ Error in listAndSaveSiteUrl:', err);
  });
}
