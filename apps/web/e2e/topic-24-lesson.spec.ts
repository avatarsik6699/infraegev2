import { test } from "./fixtures";

test("published string processing lesson is readable with eight tasks", async ({
  stringProcessingLessonPage,
  browserSession,
}) => {
  await stringProcessingLessonPage.open();
  await stringProcessingLessonPage.expectPublishedStringProcessingContent();
  browserSession.expectCleanConsole();
});

test("published string processing lesson remains readable without JavaScript", async ({
  noJavaScriptStringProcessingLessonPage,
}) => {
  await noJavaScriptStringProcessingLessonPage.open();
  await noJavaScriptStringProcessingLessonPage.expectPublishedStringProcessingContent(
    true,
  );
});
