import { test } from "./fixtures";

test("approved shared reading style keeps semantic feedback and responsive outline navigation", async ({
  topicLessonPage,
  browserSession,
}) => {
  test.setTimeout(90_000);
  await topicLessonPage.open();
  await topicLessonPage.expectReadingStyle();
  await topicLessonPage.expectStableOutlineSelection();
  browserSession.expectCleanConsole();
});

test("approved shared reading style is readable without scripts @no-js", async ({
  noJavaScriptTopicLessonPage,
}) => {
  await noJavaScriptTopicLessonPage.open();
  await noJavaScriptTopicLessonPage.expectReadingStyle(true);
});

test("shared blue links and outline apply the approved number-record reading style", async ({
  numberRecordLessonPage,
  browserSession,
}) => {
  await numberRecordLessonPage.open();
  await numberRecordLessonPage.expectSharedLearningLinkStyle();
  browserSession.expectCleanConsole();
});

test("topic study layout supports mobile anchors, breakpoints and enlarged text", async ({
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

// Change 197: topic 16 keeps its key programs unfolded; topic 5 still folds one.
test("lesson code disclosure stays transparent and return to top preserves focus", async ({
  numberRecordLessonPage,
  browserSession,
}) => {
  await numberRecordLessonPage.open();
  await numberRecordLessonPage.expectCodeDisclosureAndReturnToTop();
  browserSession.expectCleanConsole();
});

test("lesson learning blocks keep answers hidden until keyboard disclosure", async ({
  topicLessonPage,
  browserSession,
}) => {
  await topicLessonPage.open();
  await topicLessonPage.expectLearningBlocks();
  browserSession.expectCleanConsole();
});

test("lesson learning blocks disclose hints and answers without scripts @no-js", async ({
  noJavaScriptTopicLessonPage,
}) => {
  await noJavaScriptTopicLessonPage.open();
  await noJavaScriptTopicLessonPage.expectLearningBlocks(true);
});
