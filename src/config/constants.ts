import dotenv from 'dotenv';
dotenv.config();

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER!;
export const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS!;
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

export const GOOGLE_SCOPE = [
  'https://www.googleapis.com/auth/webmasters.readonly',
];
export const RABBIT_QUEUE = 'fetch_jobs';
