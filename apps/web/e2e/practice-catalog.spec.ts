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

test("continuation crosses a page boundary and returns to the originating row", async ({
  practiceCatalogPage,
}) => {
  await practiceCatalogPage.expectContinuationAndReturn();
});

test("drafts survive leaving the task and continuation failure is recoverable", async ({
  practiceCatalogPage,
}) => {
  await practiceCatalogPage.expectDraftAndContinuationFailure();
});
