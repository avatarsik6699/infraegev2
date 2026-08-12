import { test as base } from "@playwright/test";
import { AccessibilityPage } from "./pages/accessibility.page";
import { BrowserSession } from "./pages/browser-session.page";
import { ErrorTelemetryPage } from "./pages/error-telemetry.page";
import { FoundationPage } from "./pages/foundation.page";

type AppFixtures = {
  accessibilityPage: AccessibilityPage;
  browserSession: BrowserSession;
  errorTelemetryPage: ErrorTelemetryPage;
  foundationPage: FoundationPage;
  noJavaScriptFoundationPage: FoundationPage;
};

export const test = base.extend<AppFixtures>({
  accessibilityPage: async ({ page }, use) => {
    await use(new AccessibilityPage(page));
  },
  browserSession: async ({ page }, use, testInfo) => {
    await use(new BrowserSession(page, testInfo));
  },
  errorTelemetryPage: async ({ page }, use) => {
    await use(new ErrorTelemetryPage(page));
  },
  foundationPage: async ({ page }, use) => {
    await use(new FoundationPage(page));
  },
  noJavaScriptFoundationPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new FoundationPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
});
