import { fetchAndStore, upsertMetrics } from '../src/services/metrics';
import * as googleService from '../src/services/google';
import prisma from '../src/db';

// Mock prisma and Google service
jest.mock('../src/db', () => ({
  __esModule: true,
  default: {
    searchMetric: {
      upsert: jest.fn(),
    },
    $transaction: jest.fn((actions: (() => Promise<any>)[]) =>
      Promise.all(actions.map((a) => a()))
    ),
  },
}));

jest.mock('../src/services/google');

const mockMetrics = [
  {
    date: '2024-01-01',
    page: '/test-page',
    clicks: 10,
    impressions: 100,
    ctr: 0.1,
    position: 1.5,
  },
  {
    date: undefined,
    page: undefined,
    clicks: null,
    impressions: null,
    ctr: null,
    position: null,
  },
];

describe('metrics service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upsert all valid rows', async () => {
    await upsertMetrics([
      {
        date: '2024-01-01',
        page: '/sample',
        clicks: 5,
        impressions: 50,
        ctr: 0.1,
        position: 2.2,
      },
    ]);

    expect(prisma.searchMetric.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.searchMetric.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ page: '/sample' }),
      })
    );
  });

  it('should sanitize and upsert only valid metrics from fetchAndStore', async () => {
    (googleService.fetchSearchMetrics as jest.Mock).mockResolvedValue(
      mockMetrics
    );

    await fetchAndStore('https://test-site.com', '2024-01-01', '2024-04-01');

    // Should only upsert 1 row after filtering
    expect(prisma.searchMetric.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.searchMetric.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          date: expect.any(Date),
          page: '/test-page',
          clicks: 10,
          impressions: 100,
          ctr: 0.1,
          position: 1.5,
        }),
      })
    );
  });
});
