import { test } from "./fixtures";

test("published sorting and selection lesson is readable with its file practice", async ({
  arrayProcessingLessonPage,
  browserSession,
}) => {
  await arrayProcessingLessonPage.open();
  await arrayProcessingLessonPage.expectPublishedArrayProcessingContent();
  await arrayProcessingLessonPage.expectStudyNavigationAndAccessibility();
  await arrayProcessingLessonPage.expectCodeKeyboardFocus(
    "Сортировать целые записи по очкам",
  );
  browserSession.expectCleanConsole();
});

test("sorting and selection lesson keeps theory and files without JavaScript", async ({
  noJavaScriptArrayProcessingLessonPage,
}) => {
  await noJavaScriptArrayProcessingLessonPage.open();
  await noJavaScriptArrayProcessingLessonPage.expectPublishedArrayProcessingContent(
    true,
  );
});
