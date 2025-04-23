// tests/oauth.test.ts
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('google-auth-library');

describe('OAuth Token Refresh', () => {
  const tokenPath = path.join(__dirname, '../tokens.json');
  const mockRefresh = jest.fn();

  beforeAll(() => {
    (OAuth2Client as any).mockImplementation(() => ({
      setCredentials: jest.fn(),
      getAccessToken: jest.fn().mockResolvedValue('new-access-token'),
      refreshAccessToken: mockRefresh,
    }));
  });

  it('refreshes token and saves new token', async () => {
    mockRefresh.mockResolvedValueOnce({
      credentials: { access_token: 'new-token' },
    });

    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    client.setCredentials({ refresh_token: 'refresh-token' });

    const tokens = await client.refreshAccessToken();
    expect(tokens.credentials.access_token).toBe('new-token');
    expect(mockRefresh).toHaveBeenCalled();
  });
});
