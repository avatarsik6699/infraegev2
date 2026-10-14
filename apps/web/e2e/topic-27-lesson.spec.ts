import { test } from "./fixtures";

test("published data analysis lesson is readable with its bank tasks", async ({
  dataAnalysisLessonPage,
  browserSession,
}) => {
  await dataAnalysisLessonPage.open();
  await dataAnalysisLessonPage.expectPipelineLessonContent();
  browserSession.expectCleanConsole();
});

test("published data analysis lesson remains readable without JavaScript", async ({
  noJavaScriptDataAnalysisLessonPage,
}) => {
  await noJavaScriptDataAnalysisLessonPage.open();
  await noJavaScriptDataAnalysisLessonPage.expectPipelineLessonContent(true);
});
