import { test } from "./fixtures";

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
