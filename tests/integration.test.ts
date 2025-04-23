// tests/integration.test.ts
import http from 'http';
import dotenv from 'dotenv';
import fetch from 'cross-fetch'; // ✅ cross-fetch is safe for Jest

dotenv.config();

let server: http.Server;

beforeAll(async () => {
  const { default: app } = await import('../src/server');
  server = app.listen(4000);
});

afterAll((done) => {
  server.close(done);
});

describe('Integration: GraphQL with Basic Auth', () => {
  it('responds to metricsSummary query', async () => {
    const query = {
      query: `
        query {
          metricsSummary(startDate: "2024-01-01", endDate: "2024-04-01") {
            sumClicks
            sumImpressions
            avgCtr
            avgPosition
          }
        }
      `,
    };

    const res = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASS}`
          ).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    const json = (await res.json()) as any;
    expect(json.data?.metricsSummary).toHaveProperty('sumClicks');
  });
});
