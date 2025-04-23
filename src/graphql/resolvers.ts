// src/graphql/resolvers.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function metricsSummary(_: any, args: { startDate: string; endDate: string }) {
  const data = await prisma.searchMetric.findMany({
    where: {
      date: {
        gte: new Date(args.startDate),
        lte: new Date(args.endDate),
      },
    },
  });

  const sumClicks = data.reduce((sum, row) => sum + row.clicks, 0);
  const sumImpressions = data.reduce((sum, row) => sum + row.impressions, 0);
  const avgCtr = data.reduce((sum, row) => sum + row.ctr, 0) / data.length || 0;
  const avgPosition = data.reduce((sum, row) => sum + row.position, 0) / data.length || 0;

  return {
    sumClicks,
    sumImpressions,
    avgCtr,
    avgPosition,
  };
}

export const resolvers = {
  Query: {
    metricsSummary,
  },
};
