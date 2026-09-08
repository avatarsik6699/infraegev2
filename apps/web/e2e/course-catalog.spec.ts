import { test } from "./fixtures";

test("the header opens a truthful responsive mini-course catalog", async ({
  browserSession,
  courseCatalogPage,
  foundationPage,
  noJavaScriptCourseCatalogPage,
  publicDiscoveryPage,
}) => {
  await browserSession.useDesktopViewport();
  await foundationPage.open();
  await foundationPage.openCourses();
  await courseCatalogPage.expectCatalog();
  await courseCatalogPage.expectHydratedProgress();
  await courseCatalogPage.expectDesktopMosaic();
  await courseCatalogPage.dismissAnalyticsConsent();
  await courseCatalogPage.expectBoundedMotion();
  await courseCatalogPage.expectArtwork();
  await browserSession.captureFullPage("course-catalog-desktop.png");
  await courseCatalogPage.seedFirstLessonMastery();
  await courseCatalogPage.expectHydratedProgress(1);

  await browserSession.useIntermediateViewport();
  await courseCatalogPage.expectArtwork();
  await browserSession.useZoomedDesktopViewport();
  await courseCatalogPage.expectArtwork();

  await browserSession.useNarrowViewport();
  await courseCatalogPage.expectCatalog();
  await courseCatalogPage.expectMobileOrder();
  await courseCatalogPage.expectArtwork();
  await browserSession.captureFullPage("course-catalog-mobile.png");
  browserSession.expectCleanConsole();

  await noJavaScriptCourseCatalogPage.open();
  await noJavaScriptCourseCatalogPage.expectCatalog();
  await noJavaScriptCourseCatalogPage.expectProgressHidden();
  await publicDiscoveryPage.expectRobotsAndSitemap();
});

test("the catalog disables ambient motion for reduced-motion visitors", async ({
  browserSession,
  courseCatalogPage,
}) => {
  await browserSession.useReducedMotion();
  await courseCatalogPage.open();
  await courseCatalogPage.expectReducedMotion();
});

test("course details remain usable when illustrations fail", async ({
  courseCatalogPage,
}) => {
  await courseCatalogPage.open();
  await courseCatalogPage.failArtwork();
  await courseCatalogPage.expectCatalog();
  await courseCatalogPage.expectHydratedProgress();
});
