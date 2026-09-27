import { test } from "./fixtures";

test("published number sequences lesson is discoverable and readable with tasks", async ({
  numberSequencesLessonPage,
  browserSession,
}) => {
  await numberSequencesLessonPage.open();
  await numberSequencesLessonPage.expectPublishedNumberSequencesContent();
  await numberSequencesLessonPage.expectStudyNavigationAndAccessibility();
  await numberSequencesLessonPage.expectCodeKeyboardFocus(
    "Дополнить условие второго прохода",
  );
  browserSession.expectCleanConsole();
});

test("published number sequences lesson remains usable without JavaScript", async ({
  noJavaScriptNumberSequencesLessonPage,
}) => {
  await noJavaScriptNumberSequencesLessonPage.open();
  await noJavaScriptNumberSequencesLessonPage.expectPublishedNumberSequencesContent(
    true,
  );
});
