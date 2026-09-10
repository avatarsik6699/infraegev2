import { test } from "./fixtures";

test("lesson reading preview supports desktop and mobile outline navigation", async ({
  lessonReadingPreviewPage,
  browserSession,
}) => {
  await lessonReadingPreviewPage.open();
  await lessonReadingPreviewPage.expectDesktop();
  await lessonReadingPreviewPage.expectMobileNavigation();
  browserSession.expectCleanConsole();
});

test("lesson reading preview preserves practice answers and keyboard task choice", async ({
  lessonReadingPreviewPage,
  browserSession,
}) => {
  await lessonReadingPreviewPage.open();
  await lessonReadingPreviewPage.expectPracticeAndRecovery();
  browserSession.expectCleanConsole();
});

test("lesson reading preview remains complete without JavaScript", async ({
  noJavaScriptLessonReadingPreviewPage,
}) => {
  await noJavaScriptLessonReadingPreviewPage.open();
  await noJavaScriptLessonReadingPreviewPage.expectWithoutJavaScript();
});

test("lesson reading preview supports enlarged text and accessibility", async ({
  lessonReadingPreviewPage,
  browserSession,
}) => {
  await lessonReadingPreviewPage.open();
  await lessonReadingPreviewPage.expectTextScalingAndAccessibility();
  browserSession.expectCleanConsole();
});
