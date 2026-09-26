import { test } from "./fixtures";

test("numbered pages, filters and empty/invalid selections", async ({
  minimalPage,
}) => {
  await minimalPage.expectCatalog();
});

test("guest correctness feedback and drafts remain transient", async ({
  minimalPage,
}) => {
  await minimalPage.expectGuestSolveHasTransientFeedback();
});

test("failed checks preserve input and support explicit retry", async ({
  minimalPage,
}) => {
  await minimalPage.expectFailedCheck();
});

test("standalone practice is mobile SSR-readable @no-js", async ({
  noJavaScriptMinimalPage,
}) => {
  await noJavaScriptMinimalPage.expectReadablePractice();
});

test("solve multiple tasks inside catalog with transient drafts", async ({
  minimalPage,
}) => {
  await minimalPage.expectInlineSolving();
});

test("catalog links retain context without JavaScript @no-js", async ({
  noJavaScriptMinimalPage,
}) => {
  await noJavaScriptMinimalPage.expectCatalogWithoutJavaScript();
});

test("practice filters apply together and preserve the remaining selection", async ({
  minimalPage,
}) => {
  await minimalPage.expectCombinedPracticeFilters();
});

test("combined practice filters work without JavaScript @no-js", async ({
  noJavaScriptMinimalPage,
}) => {
  await noJavaScriptMinimalPage.expectCombinedPracticeFilters(true);
});

test("catalog answer follows statement and stays aligned through feedback", async ({
  minimalPage,
}) => {
  await minimalPage.expectPracticeAnswerLayout();
});

test("topic search supports cancellation, zero counts and accessible help", async ({
  minimalPage,
}) => {
  await minimalPage.expectTopicSearchAndCancellation();
});
