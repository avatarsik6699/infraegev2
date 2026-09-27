import { test } from "./fixtures";

test("published integer processing lesson is discoverable and readable", async ({
  integerProcessingLessonPage,
  browserSession,
}) => {
  await integerProcessingLessonPage.open();
  await integerProcessingLessonPage.expectPublishedIntegerProcessingContent();
  await integerProcessingLessonPage.expectStudyNavigationAndAccessibility();
  await integerProcessingLessonPage.expectCodeKeyboardFocus(
    "Найти первые пять чисел от 100 до 1000 с тремя делителями",
  );
  browserSession.expectCleanConsole();
});

test("published integer processing lesson remains usable without JavaScript", async ({
  noJavaScriptIntegerProcessingLessonPage,
}) => {
  await noJavaScriptIntegerProcessingLessonPage.open();
  await noJavaScriptIntegerProcessingLessonPage.expectPublishedIntegerProcessingContent(
    true,
  );
});
