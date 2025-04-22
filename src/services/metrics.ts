import { fetchSearchMetrics } from './google';
import prisma from '../db';

export async function upsertMetrics(
  metrics: {
    date: string;
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[]
) {
  await prisma.$transaction(
    metrics.map((row) =>
      prisma.searchMetric.upsert({
        where: {
          date_page: {
            date: new Date(row.date),
            page: row.page,
          },
        },
        update: {
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        },
        create: {
          date: new Date(row.date),
          page: row.page,
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        },
      })
    )
  );
}

export async function fetchAndStore(
  siteUrl: string,
  startDate: string,
  endDate: string
) {
  const rawMetrics = await fetchSearchMetrics(siteUrl, startDate, endDate);

  const metrics = rawMetrics
    .filter(
      (
        row
      ): row is {
        date: string;
        page: string;
        clicks: number | null | undefined;
        impressions: number | null | undefined;
        ctr: number | null | undefined;
        position: number | null | undefined;
      } => !!row.date && !!row.page
    )
    .map((row) => ({
      date: row.date,
      page: row.page,
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }));

  if (metrics.length === 0) {
    console.log('No valid metrics to store.');
    return;
  }

  await upsertMetrics(metrics);
  console.log(`✅ Fetched and stored ${metrics.length} records.`);
}
