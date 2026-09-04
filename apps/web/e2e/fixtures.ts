import { test as base } from "@playwright/test";
import { AccessibilityPage } from "./pages/accessibility.page";
import { BrowserSession } from "./pages/browser-session.page";
import { DesignSystemLabPage } from "./pages/design-system-lab.page";
import { ErrorTelemetryPage } from "./pages/error-telemetry.page";
import { FoundationPage } from "./pages/foundation.page";
import { PrivacyPage } from "./pages/privacy.page";
import { PublicDiscoveryPage } from "./pages/public-discovery.page";
import { PythonCoursePage } from "./pages/python-course.page";
import { TopicLessonPage } from "./pages/topic-lesson.page";

type AppFixtures = {
  accessibilityPage: AccessibilityPage;
  browserSession: BrowserSession;
  designSystemLabPage: DesignSystemLabPage;
  errorTelemetryPage: ErrorTelemetryPage;
  foundationPage: FoundationPage;
  noJavaScriptFoundationPage: FoundationPage;
  noJavaScriptDesignSystemLabPage: DesignSystemLabPage;
  privacyPage: PrivacyPage;
  noJavaScriptPrivacyPage: PrivacyPage;
  publicDiscoveryPage: PublicDiscoveryPage;
  pythonCoursePage: PythonCoursePage;
  noJavaScriptPythonCoursePage: PythonCoursePage;
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
  pythonCoursePage: async ({ page }, use) => {
    await use(new PythonCoursePage(page));
  },
  noJavaScriptPythonCoursePage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new PythonCoursePage(await context.newPage()));
    } finally {
      await context.close();
    }
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
