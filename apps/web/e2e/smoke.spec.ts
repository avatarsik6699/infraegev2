import { test } from "./fixtures";

test("minimal public routes retain identity and retire both labs", async ({
  minimalPage,
  noJavaScriptMinimalPage,
  browserSession,
}) => {
  await browserSession.useDesktopViewport();
  await minimalPage.expectPublicPages();
  await noJavaScriptMinimalPage.expectPublicPages();
});

for (let index = 0; index < 28; index++) {
  test(`published Python lesson ${index + 1} remains readable without JavaScript`, async ({
    noJavaScriptMinimalPage,
  }) => {
    await noJavaScriptMinimalPage.expectPublishedLesson(index);
  });
}
