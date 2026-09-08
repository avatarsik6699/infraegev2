import { test } from "./fixtures";

test("shared visual recipes keep truthful cards and usable learning input", async ({
  browserSession,
  designSystemLabPage,
  noJavaScriptDesignSystemLabPage,
}) => {
  await browserSession.useDesktopViewport();
  await designSystemLabPage.open();
  await designSystemLabPage.expectVisualLanguage();
  await designSystemLabPage.expectVisualLanguageMotion();
  await browserSession.useNarrowViewport();
  await designSystemLabPage.expectVisualLanguage();
  browserSession.expectCleanConsole();
  await noJavaScriptDesignSystemLabPage.open();
  await noJavaScriptDesignSystemLabPage.expectVisualLanguage(false);
});

test("shared light recipes respect reduced motion", async ({
  browserSession,
  designSystemLabPage,
}) => {
  await browserSession.useReducedMotion();
  await designSystemLabPage.open();
  await designSystemLabPage.expectVisualLanguageReducedMotion();
});
