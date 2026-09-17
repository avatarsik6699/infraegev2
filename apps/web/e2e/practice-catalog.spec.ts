import { test } from "./fixtures";

test("numbered pages, filters and empty/invalid selections", async ({
  minimalPage,
}) => {
  await minimalPage.expectCatalog();
});

test("accepted progress survives reload while drafts remain transient", async ({
  minimalPage,
}) => {
  await minimalPage.expectSolveAndProgress();
});

test("failed checks preserve input and support explicit retry", async ({
  minimalPage,
}) => {
  await minimalPage.expectFailedCheck();
});

test("standalone practice is mobile SSR-readable", async ({
  noJavaScriptMinimalPage,
}) => {
  await noJavaScriptMinimalPage.expectReadablePractice();
});
