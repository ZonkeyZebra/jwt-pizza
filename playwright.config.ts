import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Parallel tests, but use beforeEach hooks and isolation to prevent flakiness
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Reduced from 2 - better to fix tests than retry
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30000, // Increased from 5000 to allow proper async waits
  expect: {
    timeout: 5000, // Separate timeout for assertions
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 600 } },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // Allow more time for dev server startup
  },
});