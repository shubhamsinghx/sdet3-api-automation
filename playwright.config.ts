import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  workers: 1, // Sequential execution to avoid API rate limits

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],

  use: {
    baseURL: (process.env.BASE_URL || 'https://reqres.in/api/test-suite/collections/users').replace(/\/?$/, '/'),
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REQRES_API_KEY || '',
    },
  },

  projects: [
    {
      name: 'api-tests',
      testDir: './tests',
    },
  ],
});
