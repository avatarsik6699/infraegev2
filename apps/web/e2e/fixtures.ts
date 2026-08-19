import { test as base } from "@playwright/test";
import { AccessibilityPage } from "./pages/accessibility.page";
import { BrowserSession } from "./pages/browser-session.page";
import { DesignSystemLabPage } from "./pages/design-system-lab.page";
import { ErrorTelemetryPage } from "./pages/error-telemetry.page";
import { FoundationPage } from "./pages/foundation.page";
import { LessonLabPage } from "./pages/lesson-lab.page";
import { PrivacyPage } from "./pages/privacy.page";
import { PublicDiscoveryPage } from "./pages/public-discovery.page";
import { TopicLessonPage } from "./pages/topic-lesson.page";

type AppFixtures = {
  accessibilityPage: AccessibilityPage;
  browserSession: BrowserSession;
  designSystemLabPage: DesignSystemLabPage;
  errorTelemetryPage: ErrorTelemetryPage;
  foundationPage: FoundationPage;
  noJavaScriptFoundationPage: FoundationPage;
  lessonLabPage: LessonLabPage;
  noJavaScriptLessonLabPage: LessonLabPage;
  noJavaScriptDesignSystemLabPage: DesignSystemLabPage;
  privacyPage: PrivacyPage;
  noJavaScriptPrivacyPage: PrivacyPage;
  publicDiscoveryPage: PublicDiscoveryPage;
  topicLessonPage: TopicLessonPage;
  noJavaScriptTopicLessonPage: TopicLessonPage;
  numberRecordLessonPage: TopicLessonPage;
  noJavaScriptNumberRecordLessonPage: TopicLessonPage;
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
  privacyPage: async ({ page }, use) => {
    await use(new PrivacyPage(page));
  },
  noJavaScriptPrivacyPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new PrivacyPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  publicDiscoveryPage: async ({ page }, use) => {
    await use(new PublicDiscoveryPage(page));
  },
  topicLessonPage: async ({ page }, use) => {
    await use(new TopicLessonPage(page));
  },
  numberRecordLessonPage: async ({ page }, use) => {
    await use(
      new TopicLessonPage(page, {
        route: "/ege/5-preobrazovanie-zapisey-chisel",
        title: "Преобразование записей чисел",
        taskNumber: 5,
      }),
    );
  },
  noJavaScriptTopicLessonPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new TopicLessonPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  noJavaScriptNumberRecordLessonPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(
        new TopicLessonPage(await context.newPage(), {
          route: "/ege/5-preobrazovanie-zapisey-chisel",
          title: "Преобразование записей чисел",
          taskNumber: 5,
        }),
      );
    } finally {
      await context.close();
    }
  },
});
