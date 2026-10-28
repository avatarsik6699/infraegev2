import { defineConfig } from "@playwright/test";
import { chromiumLaunch } from "./e2e/support/chromium-launch";

const FRONTEND_URL = "http://127.0.0.2:3100";
const BACKEND_URL = "http://127.0.0.2:8100";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: [
    "layout-stability.spec.ts",
    "production-smoke.spec.ts",
    "account-integration.spec.ts",
    "billing-integration.spec.ts",
    "account-lifecycle.spec.ts",
  ],
  // Keep traces outside Vite's app root; writing them under apps/web makes the dev watcher reload
  // the page mid-test and clears controlled input state.
  outputDir: "../../.output/playwright",
  reporter: process.env.GATE_SUMMARY ? "dot" : "list",
  fullyParallel: false,
  timeout: 45_000,
  // The portfolio runs on the Vite dev server: on a shared CI runner the first visit to an
  // account page compiles heavy route modules on demand and hydration can pass 5 s.
  expect: { timeout: process.env.CI ? 15_000 : 5_000 },
  retries: 0,
  use: {
    baseURL: FRONTEND_URL,
    trace: "retain-on-failure",
    launchOptions: chromiumLaunch,
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
        "API_INTERNAL_URL=http://127.0.0.2:8100 VITE_PROXY_TARGET=http://127.0.0.2:8100 pnpm dev --host 127.0.0.2 --port 3100 --strictPort",
      url: FRONTEND_URL,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
