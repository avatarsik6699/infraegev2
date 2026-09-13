import { test } from "./fixtures";

test("static publication discovery remains available beside the task index", async ({
  publicDiscoveryPage,
}) => {
  await publicDiscoveryPage.expectRobotsAndSitemap();
});

test("catalog filters and cursor links work with keyboard", async ({
  practiceCatalogPage,
}) => {
  await practiceCatalogPage.expectFilterAndPage();
});

test("standalone success survives reload and repeating keeps history independent", async ({
  practiceCatalogPage,
}) => {
  await practiceCatalogPage.expectSolveAndRepeat();
});

test("stale and failed checks preserve input and permit explicit retry", async ({
  practiceCatalogPage,
}) => {
  await practiceCatalogPage.expectStaleAndNetwork();
});

test("mobile no-JS practice and bounded discovery respect publication", async ({
  noJavaScriptPracticeCatalogPage,
}) => {
  await noJavaScriptPracticeCatalogPage.expectNoJavaScriptAndDiscovery();
});
