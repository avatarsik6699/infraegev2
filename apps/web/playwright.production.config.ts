import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.2:3200";

export default defineConfig({
  testDir: "./e2e",
  testMatch: ["production-smoke.spec.ts", "layout-stability.spec.ts"],
  outputDir: "../../.output/playwright-production",
  reporter: "list",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  failOnFlakyTests: Boolean(process.env.CI),
  use: { baseURL, trace: "retain-on-failure", reducedMotion: "reduce" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "HOST=127.0.0.2 PORT=3200 pnpm start",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
