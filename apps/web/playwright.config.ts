import { defineConfig } from "@playwright/test";

const FRONTEND_URL =
  process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.2:3000";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.2:8000";

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
        "uv run --project ../api uvicorn app.main:app --host 127.0.0.2 --port 8000",
      url: `${BACKEND_URL}/health`,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      name: "frontend",
      command:
        "VITE_PROXY_TARGET=http://127.0.0.2:8000 pnpm dev --host 127.0.0.2",
      url: FRONTEND_URL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
