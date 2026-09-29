import { test } from "./fixtures";

test("approved shared reading style keeps semantic feedback and responsive outline navigation", async ({
  topicLessonPage,
  browserSession,
}) => {
  await topicLessonPage.open();
  await topicLessonPage.expectRecursionStylePilot();
  browserSession.expectCleanConsole();
});

test("approved shared reading style is readable without scripts @no-js", async ({
  noJavaScriptTopicLessonPage,
}) => {
  await noJavaScriptTopicLessonPage.open();
  await noJavaScriptTopicLessonPage.expectRecursionStylePilot(true);
});

test("shared blue links and outline apply the approved number-record reading style", async ({
  numberRecordLessonPage,
  browserSession,
}) => {
  await numberRecordLessonPage.open();
  await numberRecordLessonPage.expectSharedLearningLinkStyle();
  browserSession.expectCleanConsole();
});

test("recursion study layout supports mobile anchors, breakpoints and enlarged text", async ({
  topicLessonPage,
  browserSession,
}) => {
  await topicLessonPage.open();
  await topicLessonPage.expectStudyNavigationAndAccessibility();
  browserSession.expectCleanConsole();
});

test("number-record study layout supports mobile anchors, breakpoints and enlarged text", async ({
  numberRecordLessonPage,
  browserSession,
}) => {
  await numberRecordLessonPage.open();
  await numberRecordLessonPage.expectStudyNavigationAndAccessibility();
  browserSession.expectCleanConsole();
});

test.describe("touch-capable study layouts", () => {
  test.use({ hasTouch: true });

  test("touch and hybrid layouts preserve 40px outline targets", async ({
    topicLessonPage,
    browserSession,
  }) => {
    await topicLessonPage.open();
    await topicLessonPage.expectStudyNavigationAndAccessibility();
    browserSession.expectCleanConsole();
  });
});

test("study scrollbars use square geometry and preserve forced colors", async ({
  topicLessonPage,
  browserSession,
}) => {
  await topicLessonPage.open();
  await topicLessonPage.expectSquareScrollbars();
  browserSession.expectCleanConsole();
});

test("lesson code disclosure stays transparent and return to top preserves focus", async ({
  topicLessonPage,
  browserSession,
}) => {
  await topicLessonPage.open();
  await topicLessonPage.expectCodeDisclosureAndReturnToTop();
  browserSession.expectCleanConsole();
});

test("recursion learning blocks keep answers hidden until keyboard disclosure", async ({
  topicLessonPage,
  browserSession,
}) => {
  await topicLessonPage.open();
  await topicLessonPage.expectRecursionLearningBlocks();
  browserSession.expectCleanConsole();
});

test("recursion learning blocks disclose hints and answers without scripts @no-js", async ({
  noJavaScriptTopicLessonPage,
}) => {
  await noJavaScriptTopicLessonPage.open();
  await noJavaScriptTopicLessonPage.expectRecursionLearningBlocks(true);
});
