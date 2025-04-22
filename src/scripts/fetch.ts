// src/scripts/fetch.ts
import { fetchAndStore } from '../services/metrics';
import fs from 'fs';

const { siteUrl } = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
const today = new Date();
const endDate = today.toISOString().split('T')[0];
const startDate = new Date(today.setMonth(today.getMonth() - 3))
  .toISOString()
  .split('T')[0];

fetchAndStore(siteUrl, startDate, endDate).then(() => {
  console.log('✅ Manual fetch complete.');
});
