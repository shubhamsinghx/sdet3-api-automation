import dotenv from 'dotenv';
import path from 'path';

const env = process.env.ENV;

if (env) {
  // Load environment-specific file when ENV is explicitly set
  dotenv.config({ path: path.resolve(__dirname, '..', `.env.${env}`) });
}
// Fall back to .env for any missing vars
dotenv.config();

export const config = {
  baseUrl: (process.env.BASE_URL || 'https://reqres.in/api/test-suite/collections/users').replace(/\/?$/, '/'),
  apiKey: process.env.REQRES_API_KEY || '',
  timeout: Number(process.env.TIMEOUT) || 30000,
  logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
} as const;

export type Config = typeof config;
