import { defineConfig } from "@playwright/test";

const FRONTEND_URL = "http://127.0.0.2:3100";
const BACKEND_URL = "http://127.0.0.2:8100";

export default defineConfig({
  testDir: "./e2e",
  // Keep traces outside Vite's app root; writing them under apps/web makes the dev watcher reload
  // the page mid-test and clears controlled input state.
  outputDir: "../../.output/playwright",
  reporter: "list",
  fullyParallel: false,
  use: {
    baseURL: FRONTEND_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: [
    {
      name: "backend",
      command:
        "uv run --project ../api uvicorn app.main:app --host 127.0.0.2 --port 8100",
      url: `${BACKEND_URL}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      name: "frontend",
      command:
        "VITE_PROXY_TARGET=http://127.0.0.2:8100 VITE_UMAMI_WEBSITE_ID=e2e-website pnpm dev --host 127.0.0.2 --port 3100 --strictPort",
      url: FRONTEND_URL,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
