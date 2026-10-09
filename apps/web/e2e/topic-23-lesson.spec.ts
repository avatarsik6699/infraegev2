import { test } from "./fixtures";

test("topic 23 «Анализ графов» is readable with its lesson blocks", async ({
  graphAnalysisLessonPage,
  browserSession,
}) => {
  await graphAnalysisLessonPage.open();
  await graphAnalysisLessonPage.expectPublishedGraphAnalysisContent();
  await graphAnalysisLessonPage.expectStudyNavigationAndAccessibility();
  browserSession.expectCleanConsole();
});

test("topic 23 steps by hand only under reduced motion", async ({
  graphAnalysisLessonPage,
}) => {
  await graphAnalysisLessonPage.expectStepperRespectsReducedMotion(
    "Значения f от цели назад по шагам",
  );
});

test("topic 23 remains usable without JavaScript", async ({
  noJavaScriptGraphAnalysisLessonPage,
}) => {
  await noJavaScriptGraphAnalysisLessonPage.open();
  await noJavaScriptGraphAnalysisLessonPage.expectPublishedGraphAnalysisContent(
    true,
  );
});
