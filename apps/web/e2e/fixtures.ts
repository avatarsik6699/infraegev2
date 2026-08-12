import { test as base } from "@playwright/test";
import { AccessibilityPage } from "./pages/accessibility.page";
import { BrowserSession } from "./pages/browser-session.page";
import { ErrorTelemetryPage } from "./pages/error-telemetry.page";
import { HomePage } from "./pages/home.page";
import { LegalPage } from "./pages/legal.page";
import { SitemapPage } from "./pages/sitemap.page";
import { TopicPage } from "./pages/topic.page";

type AppFixtures = {
  accessibilityPage: AccessibilityPage;
  browserSession: BrowserSession;
  errorTelemetryPage: ErrorTelemetryPage;
  homePage: HomePage;
  legalPage: LegalPage;
  noJavaScriptTopicPage: TopicPage;
  sitemapPage: SitemapPage;
  topicPage: TopicPage;
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
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  legalPage: async ({ page }, use) => {
    await use(new LegalPage(page));
  },
  noJavaScriptTopicPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new TopicPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  sitemapPage: async ({ request }, use) => {
    await use(new SitemapPage(request));
  },
  topicPage: async ({ page }, use) => {
    await use(new TopicPage(page));
  },
});
