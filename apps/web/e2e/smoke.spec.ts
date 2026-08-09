import { expect, test } from "@playwright/test";
import { HomePage } from "./pages/home.page";
import { LegalPage } from "./pages/legal.page";
import { TopicPage } from "./pages/topic.page";

test("home → placeholder topic → practice checker result", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  const homePage = new HomePage(page);
  const topicPage = new TopicPage(page);

  await homePage.open();
  await homePage.openPlaceholderTopic();
  await topicPage.expectPlaceholderFixture();
  await topicPage.submitAnswer("4");
  await topicPage.expectCorrectResult();
  expect(consoleErrors).toEqual([]);
});

test("legal pages retain headings and main landmarks", async ({ page }) => {
  const legalPage = new LegalPage(page);
  await legalPage.expectPrivacy();
  await legalPage.expectTerms();
});
