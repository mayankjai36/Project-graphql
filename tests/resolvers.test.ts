// tests/resolvers.test.ts

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
      searchMetric: {
        findMany: jest.fn().mockResolvedValue([
          { clicks: 10, impressions: 100, ctr: 0.1, position: 1.5 },
          { clicks: 20, impressions: 300, ctr: 0.0667, position: 2.5 },
        ]),
      },
    })),
  }));
  
  describe('metricsSummary resolver', () => {
    it('calculates aggregated metrics correctly', async () => {
      const { metricsSummary } = await import('../src/graphql/resolvers');
  
      const result = await metricsSummary({}, {
        startDate: '2024-01-01',
        endDate: '2024-04-01',
      });
  
      expect(result.sumClicks).toBe(30);
      expect(result.sumImpressions).toBe(400);
      expect(result.avgCtr).toBeCloseTo((0.1 + 0.0667) / 2, 2);
      expect(result.avgPosition).toBeCloseTo((1.5 + 2.5) / 2, 2);
    });
  });
  