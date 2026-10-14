import { test } from "./fixtures";

test("published array processing lesson is readable with its bank tasks", async ({
  arrayProcessingLessonPage,
  browserSession,
}) => {
  await arrayProcessingLessonPage.open();
  await arrayProcessingLessonPage.expectPipelineLessonContent();
  browserSession.expectCleanConsole();
});

test("published array processing lesson remains readable without JavaScript", async ({
  noJavaScriptArrayProcessingLessonPage,
}) => {
  await noJavaScriptArrayProcessingLessonPage.open();
  await noJavaScriptArrayProcessingLessonPage.expectPipelineLessonContent(true);
});
