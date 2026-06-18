// playwright.config.ts
// Playwright config for tests/e2e/*.spec.ts. The dev server is started
// automatically (`webServer` block) before the suite runs and stopped
// after. The base URL points at the local Next.js dev server.
//
// L5 only added one spec (lessons-flow) that exercises the lesson
// panel → standalone lesson page → practice route happy path. Future
// specs will cover the LessonGate skip-vs-show branches and the
// /review "Repasar lección" cards.
import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // single-user app; parallel runs compete for the cookie
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'list' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // `next dev` (Turbopack) is faster than `next start`+`next build`
    // for a single e2e run, and matches what the dev workflow uses.
    command: `next dev --turbopack --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});