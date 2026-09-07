import { test } from "./fixtures";

test("the home topics link opens the complete public EGE catalog", async ({
  browserSession,
  foundationPage,
  noJavaScriptTopicCatalogPage,
  publicDiscoveryPage,
  topicCatalogPage,
}) => {
  await browserSession.useDesktopViewport();
  await foundationPage.open();
  await foundationPage.openTopics();
  await topicCatalogPage.expectCatalog();
  await topicCatalogPage.expectCatalogLeads();
  await topicCatalogPage.expectIllustrationsReady();
  await topicCatalogPage.expectPublishedCardGeometry();
  await topicCatalogPage.expectPlannedCardsOpaque();
  await topicCatalogPage.expectColumnCount(3);
  await topicCatalogPage.dismissAnalyticsConsent();
  await topicCatalogPage.showCatalogStart();
  await browserSession.captureViewport("topic-catalog-desktop.png");
  await topicCatalogPage.showPublishedTopics();
  await browserSession.captureViewport("topic-catalog-published.png");
  await topicCatalogPage.showRecursiveTopic();
  await browserSession.captureViewport("topic-catalog-recursion.png");
  await topicCatalogPage.showCatalogEnd();
  await browserSession.captureViewport("topic-catalog-footer.png");

  await browserSession.useZoomedDesktopViewport();
  await topicCatalogPage.expectColumnCount(2);
  await topicCatalogPage.showCatalogStart();
  await browserSession.captureViewport("topic-catalog-zoomed.png");

  await browserSession.useNarrowViewport();
  await topicCatalogPage.expectCatalog();
  await topicCatalogPage.expectCatalogLeads();
  await topicCatalogPage.expectIllustrationsReady();
  await topicCatalogPage.expectPublishedCardGeometry();
  await topicCatalogPage.expectPlannedCardsOpaque();
  await topicCatalogPage.expectColumnCount(1);
  await topicCatalogPage.showCatalogStart();
  await browserSession.captureViewport("topic-catalog-mobile.png");
  browserSession.expectCleanConsole();

  await noJavaScriptTopicCatalogPage.open();
  await noJavaScriptTopicCatalogPage.expectCatalog();
  await publicDiscoveryPage.expectRobotsAndSitemap();
});

test("a published topic card opens its lesson", async ({
  topicCatalogPage,
}) => {
  await topicCatalogPage.open();
  await topicCatalogPage.expectNumberRecordTopicOpens();
});
