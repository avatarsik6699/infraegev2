import { test } from "./fixtures";

test("minimal public routes retain identity and retire both labs @smoke", async ({
  minimalPage,
  browserSession,
}) => {
  await browserSession.useDesktopViewport();
  await minimalPage.expectPublicPages();
});

test("minimal public routes retain identity without JavaScript @no-js", async ({
  noJavaScriptMinimalPage,
}) => {
  await noJavaScriptMinimalPage.expectPublicPages();
});

for (let index = 0; index < 28; index++) {
  test(`published Python lesson ${index + 1} remains readable without JavaScript @no-js`, async ({
    noJavaScriptMinimalPage,
  }) => {
    await noJavaScriptMinimalPage.expectPublishedLesson(index);
  });
}
