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
