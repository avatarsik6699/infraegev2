import { test } from "./fixtures";

test("published number sequences lesson is readable with its bank tasks", async ({
  numberSequencesLessonPage,
  browserSession,
}) => {
  await numberSequencesLessonPage.open();
  await numberSequencesLessonPage.expectPipelineLessonContent();
  await numberSequencesLessonPage.expectStudyNavigationAndAccessibility();
  browserSession.expectCleanConsole();
});

test("published number sequences lesson remains readable without JavaScript", async ({
  noJavaScriptNumberSequencesLessonPage,
}) => {
  await noJavaScriptNumberSequencesLessonPage.open();
  await noJavaScriptNumberSequencesLessonPage.expectPipelineLessonContent(true);
});
