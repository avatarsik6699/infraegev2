import { test } from "./fixtures";

test("optional analytics is absent before opt-in and stops after withdrawal", async ({
  browserSession,
  privacyPage,
}) => {
  await browserSession.useDesktopViewport();
  await privacyPage.open();
  await privacyPage.resetAnalyticsChoice();
  await privacyPage.expectPendingAnalyticsChoice();
  await browserSession.captureViewport("analytics-consent-desktop.png");

  await browserSession.useNarrowViewport();
  await privacyPage.expectPendingAnalyticsChoice();
  await browserSession.captureViewport("analytics-consent-mobile.png");
  browserSession.expectCleanConsole();

  await privacyPage.expectOptionalAnalyticsRequiresOptIn();
  await privacyPage.scrollToFooter();
  await browserSession.captureViewport("privacy-footer-mobile.png");
});
