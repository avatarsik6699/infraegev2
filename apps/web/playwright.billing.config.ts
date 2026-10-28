import { defineConfig } from "@playwright/test";
import { prepareAccountMailbox } from "./e2e/support/account-mailbox";
import { chromiumLaunch } from "./e2e/support/chromium-launch";

const frontendUrl = "http://127.0.0.2:3100";
const backendUrl = "http://127.0.0.2:8100";
const mailbox = prepareAccountMailbox();
process.env.INFRAEGE_ACCOUNT_MAILBOX = mailbox;

export default defineConfig({
  testDir: "./e2e",
  // Change 227: the account lifecycle needs paid access and the stand-in providers too
  testMatch: ["billing-integration.spec.ts", "account-lifecycle.spec.ts"],
  outputDir: "../../.output/playwright-billing-integration",
  reporter: process.env.GATE_SUMMARY ? "dot" : "list",
  fullyParallel: false,
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  failOnFlakyTests: Boolean(process.env.CI),
  use: {
    baseURL: frontendUrl,
    trace: process.env.CI ? "off" : "retain-on-failure",
    launchOptions: chromiumLaunch,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: [
    {
      name: "backend",
      command:
        `INFRAEGE_ACCOUNT_MAILBOX=${JSON.stringify(mailbox)} APP_ENV=development ` +
        // Change 192: paid access on, the fake provider settles the payment locally
        "PAYWALL_ENABLED=true BILLING_ENABLED=true BILLING_PROVIDER=fake " +
        "AUTH_FAKE_PROVIDERS=true VK_ENABLED=true YANDEX_ENABLED=true " +
        `PUBLIC_ORIGIN=${frontendUrl} SMTP_HOST=synthetic-mailbox SMTP_PORT=1 ` +
        "MAIL_FROM=accounts@example.test uv run --project ../api " +
        "python ../../scripts/test-account-server.py --host 127.0.0.2 --port 8100",
      url: `${backendUrl}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      name: "frontend",
      command:
        `API_INTERNAL_URL=${backendUrl} VITE_PROXY_TARGET=${backendUrl} ` +
        "pnpm dev --host 127.0.0.2 --port 3100 --strictPort",
      url: frontendUrl,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
