import { test } from "./fixtures";

test("published data analysis lesson explains clustering and shows file practice", async ({
  dataAnalysisLessonPage,
  browserSession,
}) => {
  await dataAnalysisLessonPage.open();
  await dataAnalysisLessonPage.expectPublishedDataAnalysisContent();
  await dataAnalysisLessonPage.expectStudyNavigationAndAccessibility();
  await dataAnalysisLessonPage.expectCodeKeyboardFocus(
    "Разделить отсортированные энергии по размаху",
  );
  browserSession.expectCleanConsole();
});

test("data analysis lesson retains theory and files without JavaScript", async ({
  noJavaScriptDataAnalysisLessonPage,
}) => {
  await noJavaScriptDataAnalysisLessonPage.open();
  await noJavaScriptDataAnalysisLessonPage.expectPublishedDataAnalysisContent(
    true,
  );
});
