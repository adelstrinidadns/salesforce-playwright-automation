import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  globalSetup: require.resolve('./global-setup.ts'),
  timeout: 120000,
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  repeatEach: 1,
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'https://rri--fullsb.sandbox.lightning.force.com',
    launchOptions: {
      slowMo: 1000, // Slow down actions by 1 second for better visibility
    },
    trace: 'on-first-retry',
    storageState: '.auth/user.json', // Reuse authentication state
  },

  projects: [
    // Setup project - runs first if needed
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },

    // Main test project - uses saved authentication state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
    },
  ],
});
