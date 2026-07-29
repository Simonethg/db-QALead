import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(import.meta.dirname, '.env') });

const environment = process.env.NODE_ENV || 'staging';

const baseURLs: Record<string, string> = {
  staging: 'https://www.demoblaze.com',
  production: 'https://www.demoblaze.com',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: baseURLs[environment] || baseURLs.staging,
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: process.env.CI ? true : false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
