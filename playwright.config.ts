import { defineConfig, devices } from '@playwright/test';

/**
 * Config for the UI tests Skyramp Testbot generates and commits.
 *
 * Testbot writes specs to `.skyramp/` by default (no `.skyramp/workspace.yml`
 * declares a testDirectory), so both that and a conventional `tests/` dir are
 * matched — otherwise default discovery finds nothing once the specs land.
 *
 * Only `.spec.ts` is matched, which deliberately excludes the Cypress suite in
 * `cypress/integration/*.spec.js`.
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['.skyramp/**/*.spec.ts', 'tests/**/*.spec.ts'],
  testIgnore: ['dist/**', 'node_modules/**'],

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    // Generated specs navigate to absolute URLs (http://localhost:5173/...),
    // so this is mostly for any hand-written test that uses relative paths.
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      // Playwright's bundled Chromium, NOT channel: 'chrome'. Playwright refuses
      // to install real Google Chrome on Linux ARM64, which is where the
      // fusion-mac runner lives (see SKYR-4135).
      use: { ...devices['Desktop Chrome'], channel: undefined },
    },
  ],

  // Start the dev server the specs expect on :5173. Skyramp's own executor
  // rewrites localhost -> host.docker.internal when it runs these in a
  // container; here they run directly against the host, so localhost is correct.
  webServer: {
    command: 'pnpm run dev --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
