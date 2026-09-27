import { CourseCatalogPage } from "./pages/course-catalog.page";
import { AccountPage } from "./pages/account.page";
import { AccountIntegrationPage } from "./pages/account-integration.page";
import { MinimalApplicationPage } from "./pages/minimal-application.page";
import { PracticeCutoverPage } from "./pages/practice-cutover.page";
import { test as base, type Browser } from "@playwright/test";
import { AccessibilityPage } from "./pages/accessibility.page";
import { BrowserSession } from "./pages/browser-session.page";
import { PublicDiscoveryPage } from "./pages/public-discovery.page";
import { TopicLessonPage } from "./pages/topic-lesson.page";

import { TopicCatalogPage } from "./pages/topic-catalog.page";
import {
  readVerificationLink,
  removeAccountMailbox,
} from "./support/account-mailbox";

type AppFixtures = {
  accountPage: AccountPage;
  accountIdentity: { email: string; password: string };
  accountIntegrationPage: AccountIntegrationPage;
  accountMailbox: { readVerificationLink(): string };
  noJavaScriptAccountPage: AccountPage;
  courseCatalogPage: CourseCatalogPage;
  noJavaScriptCourseCatalogPage: CourseCatalogPage;
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
  numberSequencesLessonPage: TopicLessonPage;
  noJavaScriptNumberSequencesLessonPage: TopicLessonPage;
  stringProcessingLessonPage: TopicLessonPage;
  noJavaScriptStringProcessingLessonPage: TopicLessonPage;
};

const numberRecordLessonConfig = {
  route: "/ege/5-preobrazovanie-zapisey-chisel",
  title: "Преобразование записей чисел",
  taskNumber: 5,
};

const numberSequencesLessonConfig = {
  route: "/ege/17-chislovye-posledovatelnosti",
  title: "Числовые последовательности",
  taskNumber: 17,
  taskCount: 8,
};

const stringProcessingLessonConfig = {
  route: "/ege/24-obrabotka-simvolnyh-strok",
  title: "Обработка символьных строк",
  taskNumber: 24,
  taskCount: 8,
};

async function useNoJavaScriptTopicLesson(
  browser: Browser,
  baseURL: string | undefined,
  use: (page: TopicLessonPage) => Promise<void>,
  config?: ConstructorParameters<typeof TopicLessonPage>[1],
) {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    await use(new TopicLessonPage(await context.newPage(), config));
  } finally {
    await context.close();
  }
}

export const test = base.extend<AppFixtures>({
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  accountIntegrationPage: async ({ page }, use) => {
    await use(new AccountIntegrationPage(page));
  },
  accountIdentity: async ({ browser }, use, testInfo) => {
    void browser;
    await use({
      email: `account-browser-${String(testInfo.workerIndex)}@example.com`,
      password: "correct horse battery",
    });
  },
  accountMailbox: async ({ browser }, use) => {
    void browser;
    const mailbox = process.env.INFRAEGE_ACCOUNT_MAILBOX;
    if (!mailbox)
      throw new Error("account integration mailbox is not configured");
    try {
      await use({ readVerificationLink: () => readVerificationLink(mailbox) });
    } finally {
      removeAccountMailbox();
    }
  },
  noJavaScriptAccountPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new AccountPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  courseCatalogPage: async ({ page }, use) => {
    await use(new CourseCatalogPage(page));
  },
  noJavaScriptCourseCatalogPage: async ({ baseURL, browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      await use(new CourseCatalogPage(await context.newPage()));
    } finally {
      await context.close();
    }
  },
  topicCatalogPage: async ({ page }, use) => {
    await page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          account: {
            id: "catalog-member",
            email: "member@example.test",
            methods: [{ provider: "email", subject_hint: null }],
          },
          csrf_token: "test-csrf",
        },
      }),
    );
    await page.route("**/api/progress", (route) =>
      route.fulfill({ json: { results: [] } }),
    );
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
    await use(new TopicLessonPage(page, numberRecordLessonConfig));
  },
  numberSequencesLessonPage: async ({ page }, use) => {
    await use(new TopicLessonPage(page, numberSequencesLessonConfig));
  },
  stringProcessingLessonPage: async ({ page }, use) => {
    await use(new TopicLessonPage(page, stringProcessingLessonConfig));
  },
  noJavaScriptTopicLessonPage: async ({ baseURL, browser }, use) => {
    await useNoJavaScriptTopicLesson(browser, baseURL, use);
  },
  noJavaScriptNumberRecordLessonPage: async ({ baseURL, browser }, use) => {
    await useNoJavaScriptTopicLesson(
      browser,
      baseURL,
      use,
      numberRecordLessonConfig,
    );
  },
  noJavaScriptNumberSequencesLessonPage: async ({ baseURL, browser }, use) => {
    await useNoJavaScriptTopicLesson(
      browser,
      baseURL,
      use,
      numberSequencesLessonConfig,
    );
  },
  noJavaScriptStringProcessingLessonPage: async ({ baseURL, browser }, use) => {
    await useNoJavaScriptTopicLesson(
      browser,
      baseURL,
      use,
      stringProcessingLessonConfig,
    );
  },
});
