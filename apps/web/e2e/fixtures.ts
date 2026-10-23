import { CourseCatalogPage } from "./pages/course-catalog.page";
import { AccountPage } from "./pages/account.page";
import { AccountIntegrationPage } from "./pages/account-integration.page";
import { BillingIntegrationPage } from "./pages/billing-integration.page";
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
  billingIntegrationPage: BillingIntegrationPage;
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
  graphAnalysisLessonPage: TopicLessonPage;
  noJavaScriptGraphAnalysisLessonPage: TopicLessonPage;
  divisorsAndMasksLessonPage: TopicLessonPage;
  noJavaScriptDivisorsAndMasksLessonPage: TopicLessonPage;
  arrayProcessingLessonPage: TopicLessonPage;
  noJavaScriptArrayProcessingLessonPage: TopicLessonPage;
  dataAnalysisLessonPage: TopicLessonPage;
  noJavaScriptDataAnalysisLessonPage: TopicLessonPage;
};

const numberRecordLessonConfig = {
  route: "/ege/5-preobrazovanie-zapisey-chisel/chislo-i-zapis",
  title: "Формальное исполнение алгоритма",
  taskNumber: 5,
  taskCount: 39,
  masteryTaskCount: 39,
  diagramCount: 12,
};

const numberSequencesLessonConfig = {
  route: "/ege/17-chislovye-posledovatelnosti/chisla-i-proverki",
  title: "Обработка числовой последовательности",
  taskNumber: 17,
  taskCount: 44,
  masteryTaskCount: 40,
  diagramCount: 9,
  downloadCount: 24,
};

const stringProcessingLessonConfig = {
  route: "/ege/24-obrabotka-simvolnyh-strok/stroka-i-cepochka",
  title: "Обработка символьной информации",
  taskNumber: 24,
  taskCount: 66,
  masteryTaskCount: 54,
  diagramCount: 6,
  downloadCount: 35,
};

const graphAnalysisLessonConfig = {
  route: "/ege/23-analiz-grafov/put-do-celi",
  title: "Анализ графов",
  taskNumber: 23,
  taskCount: 37,
  masteryTaskCount: 32,
};

const divisorsAndMasksLessonConfig = {
  route: "/ege/25-deliteli-i-maski/deliteli-parami",
  title: "Обработка целочисленной информации",
  taskNumber: 25,
  taskCount: 59,
  masteryTaskCount: 53,
};

const arrayProcessingLessonConfig = {
  route: "/ege/26-sortirovka-i-otbor/zapisi-i-rejting",
  title: "Обработка данных с сортировкой",
  taskNumber: 26,
  taskCount: 72,
  masteryTaskCount: 59,
  diagramCount: 14,
  downloadCount: 26,
};

const dataAnalysisLessonConfig = {
  route: "/ege/27-analiz-dannyh-i-klasterizatsiya/tochki-i-rasstoyaniya",
  title: "Анализ данных",
  taskNumber: 27,
  taskCount: 42,
  masteryTaskCount: 33,
  diagramCount: 24,
  downloadCount: 26,
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
    await use(new TopicLessonPage(await context.newPage(), config, true));
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
  billingIntegrationPage: async ({ page }, use) => {
    await use(new BillingIntegrationPage(page));
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
  courseCatalogPage: async ({ page, baseURL }, use) => {
    // The production layout server has no API reverse proxy. Keep its visual
    // checks deterministic while normal dev E2E still exercises the backend.
    if (baseURL && new URL(baseURL).port === "3200") {
      await page.route("**/api/auth/session", (route) =>
        route.fulfill({ json: { account: null, csrf_token: null } }),
      );
    }
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
  minimalPage: async ({ page, baseURL }, use) => {
    if (baseURL && new URL(baseURL).port === "3200") {
      await page.route("**/api/auth/session", (route) =>
        route.fulfill({ json: { account: null, csrf_token: null } }),
      );
    }
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
  browserSession: async ({ page }, use) => {
    await use(new BrowserSession(page));
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
  graphAnalysisLessonPage: async ({ page }, use) => {
    await use(new TopicLessonPage(page, graphAnalysisLessonConfig));
  },
  divisorsAndMasksLessonPage: async ({ page }, use) => {
    await use(new TopicLessonPage(page, divisorsAndMasksLessonConfig));
  },
  arrayProcessingLessonPage: async ({ page }, use) => {
    await use(new TopicLessonPage(page, arrayProcessingLessonConfig));
  },
  dataAnalysisLessonPage: async ({ page }, use) => {
    await use(new TopicLessonPage(page, dataAnalysisLessonConfig));
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
  noJavaScriptGraphAnalysisLessonPage: async ({ baseURL, browser }, use) => {
    await useNoJavaScriptTopicLesson(
      browser,
      baseURL,
      use,
      graphAnalysisLessonConfig,
    );
  },
  noJavaScriptDivisorsAndMasksLessonPage: async ({ baseURL, browser }, use) => {
    await useNoJavaScriptTopicLesson(
      browser,
      baseURL,
      use,
      divisorsAndMasksLessonConfig,
    );
  },
  noJavaScriptArrayProcessingLessonPage: async ({ baseURL, browser }, use) => {
    await useNoJavaScriptTopicLesson(
      browser,
      baseURL,
      use,
      arrayProcessingLessonConfig,
    );
  },
  noJavaScriptDataAnalysisLessonPage: async ({ baseURL, browser }, use) => {
    await useNoJavaScriptTopicLesson(
      browser,
      baseURL,
      use,
      dataAnalysisLessonConfig,
    );
  },
});
