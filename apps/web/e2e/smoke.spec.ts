import { test } from "./fixtures";

test("the unlisted lesson lab works across viewports and without JavaScript", async ({
  browserSession,
  lessonLabPage,
  noJavaScriptLessonLabPage,
}) => {
  await browserSession.useWideViewport();
  await lessonLabPage.open();
  await lessonLabPage.expectBoundedMarginalia();
  await lessonLabPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("lesson-lab-wide.png");

  await browserSession.useDesktopViewport();
  await lessonLabPage.open();
  await lessonLabPage.expectLessonStructure();
  await lessonLabPage.expectCodeExampleSurface();
  await lessonLabPage.expectUnlistedMetadata();
  await lessonLabPage.expectLessonNavigation();
  await browserSession.captureViewport("lesson-lab-practice-initial.png");
  await lessonLabPage.expectReadingPosition();
  await lessonLabPage.expectPracticeFeedback();
  await lessonLabPage.expectContinuousFrame();
  await lessonLabPage.expectStableFontContract();
  await lessonLabPage.expectBoundedMarginalia();
  await lessonLabPage.expectSectionRhythm();
  await lessonLabPage.expectWhitespaceGrouping();
  await lessonLabPage.expectDesktopOutlineGeometry();
  await lessonLabPage.expectOutlineTracksReadingPosition();
  await browserSession.captureViewport("lesson-lab-desktop.png");

  await browserSession.useIntermediateViewport();
  await lessonLabPage.open();
  await lessonLabPage.expectContinuousFrame();
  await lessonLabPage.expectNoHorizontalOverflow();
  await lessonLabPage.expectCompactOutlineList();
  await browserSession.captureViewport("lesson-lab-intermediate.png");

  await browserSession.useNarrowViewport();
  await lessonLabPage.open();
  await lessonLabPage.expectContinuousFrame();
  await lessonLabPage.expectNoHorizontalOverflow();
  await lessonLabPage.expectSectionRhythm();
  await lessonLabPage.expectWhitespaceGrouping();
  await lessonLabPage.expectCompactOutlineList();
  await lessonLabPage.expectMobilePracticeTabs();
  await browserSession.captureViewport("lesson-lab-narrow.png");
  browserSession.expectCleanConsole();

  await noJavaScriptLessonLabPage.expectReadableWithoutJavaScript();
  await lessonLabPage.expectBackNavigation();
});

test("the neutral root and unknown routes remain safe", async ({
  errorTelemetryPage,
  foundationPage,
}) => {
  await foundationPage.open();
  await foundationPage.expectNeutralPlaceholder();
  await foundationPage.expectRemovedRouteNotFound();
  await errorTelemetryPage.expectSanitizedGlobalErrorDelivery();
});

test("the design-system catalog works across viewports and without JavaScript", async ({
  browserSession,
  designSystemLabPage,
  noJavaScriptDesignSystemLabPage,
}) => {
  await browserSession.useDesktopViewport();
  await designSystemLabPage.open();
  await designSystemLabPage.expectCatalogStructure();
  await designSystemLabPage.expectUnlistedMetadata();
  await designSystemLabPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("design-system-lab-desktop.png");

  await browserSession.useNarrowViewport();
  await designSystemLabPage.open();
  await designSystemLabPage.expectCatalogStructure();
  await designSystemLabPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("design-system-lab-mobile.png");
  browserSession.expectCleanConsole();

  await noJavaScriptDesignSystemLabPage.expectLinearContentWithoutJavaScript();
});

test("the recursion lesson stays review-only and readable across runtimes", async ({
  browserSession,
  noJavaScriptTopicLessonPage,
  topicLessonPage,
}) => {
  await browserSession.useDesktopViewport();
  await topicLessonPage.open();
  await topicLessonPage.expectReviewLesson();
  await topicLessonPage.expectNoHorizontalOverflow();

  await browserSession.useNarrowViewport();
  await topicLessonPage.open();
  await topicLessonPage.expectReviewLesson();
  await topicLessonPage.expectNoHorizontalOverflow();
  browserSession.expectCleanConsole();

  await noJavaScriptTopicLessonPage.expectReadableWithoutJavaScript();
  await topicLessonPage.expectUnknownLessonNotFound();
});
