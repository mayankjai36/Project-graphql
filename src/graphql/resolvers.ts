import prisma from '../db';

export const resolvers = {
  Query: {
    metricsSummary: async (
      _: any,
      args: { startDate: string; endDate: string }
    ) => {
      const result = await prisma.searchMetric.aggregate({
        _sum: { clicks: true, impressions: true },
        _avg: { ctr: true, position: true },
        where: {
          date: {
            gte: new Date(args.startDate),
            lte: new Date(args.endDate),
          },
        },
      });
      return {
        sumClicks: result._sum.clicks || 0,
        sumImpressions: result._sum.impressions || 0,
        avgCtr: result._avg.ctr || 0,
        avgPosition: result._avg.position || 0,
      };
    },
  },
};
