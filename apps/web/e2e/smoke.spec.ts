import { expect, test } from "@playwright/test";
import { HomePage } from "./pages/home.page";
import { LegalPage } from "./pages/legal.page";
import { TopicPage, TOPIC_TITLE } from "./pages/topic.page";

test("published topic is discoverable, readable, and mastered at its threshold", async ({
  browser,
  page,
}, testInfo) => {
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
    if (message.type() === "warning") consoleWarnings.push(message.text());
  });
  const homePage = new HomePage(page);
  const topicPage = new TopicPage(page);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await homePage.open();
  await homePage.openGraphsAndTablesTopic();
  await topicPage.expectPublishedLesson();
  await topicPage.expectKeyboardVisibleSubmit();
  await page.screenshot({
    path: testInfo.outputPath("graphs-and-tables-desktop.png"),
    fullPage: true,
  });

  await topicPage.submitTask(0, "Б");
  await topicPage.submitTask(1, "8 км");
  await topicPage.submitTask(2, "Д");
  await topicPage.expectProgress(60, 3);
  await topicPage.expectNotMastered();
  await topicPage.submitTask(3, "24");
  await topicPage.expectProgress(80, 4);
  await topicPage.expectMastered();

  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("/theory/zadanie-1-graphs-and-tables");

  await page.setViewportSize({ width: 390, height: 844 });
  await topicPage.expectNoHorizontalOverflow();
  await page.screenshot({
    path: testInfo.outputPath("graphs-and-tables-narrow.png"),
    fullPage: true,
  });
  await topicPage.submitTask(4, "11 км");
  await topicPage.expectProgress(100, 5);
  await topicPage.expectMastered();
  expect(consoleErrors).toEqual([]);
  expect(consoleWarnings).toEqual([]);

  const noJsContext = await browser.newContext({
    baseURL: new URL(page.url()).origin,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noJsPage = await noJsContext.newPage();
  try {
    await noJsPage.goto("/theory/zadanie-1-graphs-and-tables");
    await expect(noJsPage).toHaveTitle(TOPIC_TITLE);
    await expect(
      noJsPage.getByText("Начинать с перебора опасно", { exact: false }),
    ).toBeVisible();
    await expect(noJsPage.locator("main form")).toHaveCount(5);
  } finally {
    await noJsContext.close();
  }
});

test("legal pages retain headings and main landmarks", async ({ page }) => {
  const legalPage = new LegalPage(page);
  await legalPage.expectPrivacy();
  await legalPage.expectTerms();
});
