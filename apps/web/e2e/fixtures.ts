import { MinimalApplicationPage } from "./pages/minimal-application.page";
import { PracticeCutoverPage } from "./pages/practice-cutover.page";
import { test as base } from "@playwright/test";
import { AccessibilityPage } from "./pages/accessibility.page";
import { BrowserSession } from "./pages/browser-session.page";
import { PublicDiscoveryPage } from "./pages/public-discovery.page";
import { TopicLessonPage } from "./pages/topic-lesson.page";

import { TopicCatalogPage } from "./pages/topic-catalog.page";

type AppFixtures = {
  topicCatalogPage: TopicCatalogPage;
  noJavaScriptTopicCatalogPage: TopicCatalogPage;
  minimalPage: MinimalApplicationPage;
  noJavaScriptMinimalPage: MinimalApplicationPage;
  practiceCutoverPage: PracticeCutoverPage;
  noJavaScriptPracticeCutoverPage: PracticeCutoverPage;
  accessibilityPage: AccessibilityPage;
  browserSession: BrowserSession;
  publicDiscoveryPage: PublicDiscoveryPage;
  topicLessonPage: TopicLessonPage;
  noJavaScriptTopicLessonPage: TopicLessonPage;
  numberRecordLessonPage: TopicLessonPage;
  noJavaScriptNumberRecordLessonPage: TopicLessonPage;
};

export const test = base.extend<AppFixtures>({
  topicCatalogPage: async ({ page }, use) => {
    await use(new TopicCatalogPage(page));
  },
  noJavaScriptTopicCatalogPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new TopicCatalogPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  minimalPage: async ({ page }, use) => {
    await use(new MinimalApplicationPage(page));
  },
  noJavaScriptMinimalPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new MinimalApplicationPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  practiceCutoverPage: async ({ page }, use) => {
    await use(new PracticeCutoverPage(page));
  },
  noJavaScriptPracticeCutoverPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new PracticeCutoverPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  accessibilityPage: async ({ page }, use) => {
    await use(new AccessibilityPage(page));
  },
  browserSession: async ({ page }, use, testInfo) => {
    await use(new BrowserSession(page, testInfo));
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
