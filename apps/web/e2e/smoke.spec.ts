import { test } from "@playwright/test";
import { HomePage } from "./pages/home.page";
import { TopicPage } from "./pages/topic.page";

test("home → placeholder topic → practice checker result", async ({ page }) => {
  const homePage = new HomePage(page);
  const topicPage = new TopicPage(page);

  await homePage.open();
  await homePage.openPlaceholderTopic();
  await topicPage.expectPlaceholderFixture();
  await topicPage.submitAnswer("4");
  await topicPage.expectCorrectResult();
});
