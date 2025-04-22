import { loadClient } from '../auth/oauth';

export async function fetchSearchMetrics(
  siteUrl: string,
  startDate: string,
  endDate: string
) {
  const client = loadClient();
  const { data } = await client.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date', 'page'],
    },
  });

  return (data.rows || []).map((row) => ({
    date: row.keys?.[0],
    page: row.keys?.[1],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
}
