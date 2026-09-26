import { test } from "./fixtures";

test("course catalog exposes one overview action and truthful metadata", async ({
  courseCatalogPage,
}) => {
  await courseCatalogPage.expectCatalog();
});

test("course catalog stays usable without scripts @no-js", async ({
  noJavaScriptCourseCatalogPage,
}) => {
  await noJavaScriptCourseCatalogPage.expectCatalog(true);
});

for (const width of [1305, 820, 390, 360]) {
  for (const failedAssets of [false, true]) {
    test(`courses stay stable at ${String(width)}px with ${failedAssets ? "failed" : "delayed"} assets and delayed hydration`, async ({
      courseCatalogPage,
    }) => {
      await courseCatalogPage.expectStableDelivery(width, failedAssets);
    });
  }
}

test("courses support keyboard navigation, reduced motion and enlarged text", async ({
  courseCatalogPage,
}) => {
  await courseCatalogPage.expectKeyboardAndMotion();
});
