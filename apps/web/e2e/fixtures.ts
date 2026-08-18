import { test as base } from "@playwright/test";
import { AccessibilityPage } from "./pages/accessibility.page";
import { BrowserSession } from "./pages/browser-session.page";
import { DesignSystemLabPage } from "./pages/design-system-lab.page";
import { ErrorTelemetryPage } from "./pages/error-telemetry.page";
import { FoundationPage } from "./pages/foundation.page";
import { LessonLabPage } from "./pages/lesson-lab.page";

type AppFixtures = {
  accessibilityPage: AccessibilityPage;
  browserSession: BrowserSession;
  designSystemLabPage: DesignSystemLabPage;
  errorTelemetryPage: ErrorTelemetryPage;
  foundationPage: FoundationPage;
  lessonLabPage: LessonLabPage;
  noJavaScriptLessonLabPage: LessonLabPage;
  noJavaScriptDesignSystemLabPage: DesignSystemLabPage;
};

export const test = base.extend<AppFixtures>({
  accessibilityPage: async ({ page }, use) => {
    await use(new AccessibilityPage(page));
  },
  browserSession: async ({ page }, use, testInfo) => {
    await use(new BrowserSession(page, testInfo));
  },
  designSystemLabPage: async ({ page }, use) => {
    await use(new DesignSystemLabPage(page));
  },
  errorTelemetryPage: async ({ page }, use) => {
    await use(new ErrorTelemetryPage(page));
  },
  foundationPage: async ({ page }, use) => {
    await use(new FoundationPage(page));
  },
  lessonLabPage: async ({ page }, use) => {
    await use(new LessonLabPage(page));
  },
  noJavaScriptLessonLabPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new LessonLabPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  noJavaScriptDesignSystemLabPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new DesignSystemLabPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
});
