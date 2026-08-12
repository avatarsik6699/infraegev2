import { test } from "./fixtures";

test("the neutral Table of Contents stand works across viewports and without JavaScript", async ({
  browserSession,
  foundationPage,
  noJavaScriptFoundationPage,
}) => {
  await browserSession.useDesktopViewport();
  await foundationPage.open();
  await foundationPage.expectTableOfContentsStand();
  await foundationPage.expectAnchorNavigation();
  await browserSession.captureFullPage("foundation-desktop.png");

  await browserSession.useNarrowViewport();
  await foundationPage.open();
  await foundationPage.expectNoHorizontalOverflow();
  await browserSession.captureFullPage("foundation-narrow.png");
  browserSession.expectCleanConsole();

  await noJavaScriptFoundationPage.expectReadableWithoutJavaScript();
});

test("unknown routes recover and browser errors are privacy-safe", async ({
  errorTelemetryPage,
  foundationPage,
}) => {
  await foundationPage.expectRemovedRouteNotFound();
  await errorTelemetryPage.expectSanitizedGlobalErrorDelivery();
});
