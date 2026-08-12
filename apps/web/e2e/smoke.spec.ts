import { test } from "./fixtures";

test("published topic is discoverable, readable, and mastered at its threshold", async ({
  browserSession,
  homePage,
  noJavaScriptTopicPage,
  sitemapPage,
  topicPage,
}) => {
  await browserSession.useDesktopViewport();
  await homePage.open();
  await homePage.openGraphsAndTablesTopic();
  await topicPage.expectPublishedLesson();
  await topicPage.expectKeyboardVisibleSubmit();
  await browserSession.captureFullPage("graphs-and-tables-desktop.png");

  await topicPage.submitCorrectTask(0, "Б");
  await topicPage.submitCorrectTask(1, "8 км");
  await topicPage.submitCorrectTask(2, "Д");
  await topicPage.expectProgress(60, 3);
  await topicPage.expectNotMastered();
  await topicPage.submitCorrectTask(3, "24");
  await topicPage.expectProgress(80, 4);
  await topicPage.expectMastered();

  await sitemapPage.expectPublishedTopic("/theory/zadanie-1-graphs-and-tables");

  await browserSession.useNarrowViewport();
  await topicPage.expectNoHorizontalOverflow();
  await browserSession.captureFullPage("graphs-and-tables-narrow.png");
  await topicPage.submitCorrectTask(4, "11 км");
  await topicPage.expectProgress(100, 5);
  await topicPage.expectMastered();
  browserSession.expectCleanConsole();

  await noJavaScriptTopicPage.open();
  await noJavaScriptTopicPage.expectReadableWithoutJavaScript();
});

test("legal pages retain headings and main landmarks", async ({
  legalPage,
}) => {
  await legalPage.expectPrivacy();
  await legalPage.expectTerms();
});
