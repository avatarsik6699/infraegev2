import { test } from "./fixtures";

test("minimal page remains readable while fonts are pending and unavailable", async ({
  minimalPage,
}) => {
  await minimalPage.expectStableDelivery();
});

test("mobile lesson outline keeps its first-paint height through hydration", async ({
  minimalPage,
}) => {
  await minimalPage.expectStableLessonOutline();
});

test("practice controls retain SSR geometry through hydration and filtering", async ({
  minimalPage,
}) => {
  await minimalPage.expectStablePracticeControls();
});

test("practice toolbar stays fixed through answer feedback", async ({
  minimalPage,
}) => {
  await minimalPage.expectPracticeToolbarStability();
});

test("practice navigation remains usable without JavaScript @no-js", async ({
  noJavaScriptMinimalPage,
}) => {
  await noJavaScriptMinimalPage.expectCatalogWithoutJavaScript();
});
