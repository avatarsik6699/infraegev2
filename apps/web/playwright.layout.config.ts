import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.2:3200";

export default defineConfig({
  testDir: "./e2e",
  testMatch: ["layout-stability.spec.ts", "topic-catalog.spec.ts"],
  outputDir: "../../.output/playwright-layout",
  reporter: "list",
  workers: 1,
  use: { baseURL, trace: "retain-on-failure", reducedMotion: "reduce" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "HOST=127.0.0.2 PORT=3200 pnpm start",
    url: baseURL,
    reuseExistingServer: false,
  },
});
