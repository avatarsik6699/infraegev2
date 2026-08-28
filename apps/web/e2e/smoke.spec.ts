import { test } from "./fixtures";

test("the published Python course is discoverable and complete", async ({
  browserSession,
  noJavaScriptPythonCoursePage,
  pythonCoursePage,
}) => {
  await browserSession.useDesktopViewport();
  await pythonCoursePage.openOverview();
  await pythonCoursePage.dismissAnalyticsPrompt();
  await pythonCoursePage.expectPublishedOverview();
  await browserSession.captureViewport("python-course-published-desktop.png");

  await pythonCoursePage.openConditionsLesson();
  await pythonCoursePage.expectReviewConditionsLesson();
  await pythonCoursePage.expectKeyboardDisclosures();
  await pythonCoursePage.expectConditionsPractice();
  await browserSession.captureViewport("python-conditions-review-desktop.png");

  await pythonCoursePage.openFirstLesson();
  await pythonCoursePage.expectPublishedLesson();
  await pythonCoursePage.expectKeyboardDisclosures();
  await browserSession.captureViewport(
    "python-first-program-published-desktop.png",
  );
  await pythonCoursePage.expectPracticeAndReset();
  await browserSession.captureViewport(
    "python-first-program-practice-desktop.png",
  );

  await browserSession.useZoomedDesktopViewport();
  await pythonCoursePage.openOverview();
  await pythonCoursePage.expectPublishedOverview();
  await pythonCoursePage.openConditionsLesson();
  await pythonCoursePage.expectReviewConditionsLesson();
  await browserSession.captureViewport("python-conditions-review-zoomed.png");

  await browserSession.useNarrowViewport();
  await pythonCoursePage.openConditionsLesson();
  await pythonCoursePage.expectReviewConditionsLesson();
  await pythonCoursePage.expectMobileReadingOrder();
  await browserSession.captureViewport("python-conditions-review-mobile.png");
  browserSession.expectCleanConsole();

  await noJavaScriptPythonCoursePage.expectOverviewReadableWithoutJavaScript();
  await noJavaScriptPythonCoursePage.expectReadableWithoutJavaScript();
  await noJavaScriptPythonCoursePage.expectConditionsReadableWithoutJavaScript();
});

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
  await lessonLabPage.expectSimpleDesktopOutline();
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

test("the public root exposes only published material and unknown routes remain safe", async ({
  browserSession,
  errorTelemetryPage,
  foundationPage,
  noJavaScriptFoundationPage,
}) => {
  await browserSession.useDesktopViewport();
  await foundationPage.open();
  await foundationPage.expectPublishedMaterial();
  await foundationPage.expectBrandMetadata();
  await foundationPage.expectDesktopComposition();
  await foundationPage.expectNoHorizontalOverflow();
  await foundationPage.expectStableReload();
  await browserSession.captureViewport("public-home-desktop.png");

  await browserSession.useZoomedDesktopViewport();
  await foundationPage.open();
  await foundationPage.expectPublishedMaterial();
  await foundationPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("public-home-zoomed.png");

  await browserSession.useNarrowViewport();
  await foundationPage.open();
  await foundationPage.expectPublishedMaterial();
  await foundationPage.expectMobileComposition();
  await foundationPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("public-home-mobile.png");
  await noJavaScriptFoundationPage.open();
  await noJavaScriptFoundationPage.expectPublishedMaterial();
  await noJavaScriptFoundationPage.expectNoHorizontalOverflow();
  browserSession.expectCleanConsole();
  await foundationPage.expectRemovedRouteNotFound();
  await errorTelemetryPage.expectSanitizedGlobalErrorDelivery();
});

test("privacy and crawl surfaces describe the public release", async ({
  browserSession,
  noJavaScriptPrivacyPage,
  privacyPage,
  publicDiscoveryPage,
}) => {
  await browserSession.useDesktopViewport();
  await privacyPage.open();
  await privacyPage.expectCurrentDisclosure();
  await privacyPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("privacy-desktop.png");

  await browserSession.useNarrowViewport();
  await privacyPage.open();
  await privacyPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("privacy-mobile.png");
  browserSession.expectCleanConsole();

  await noJavaScriptPrivacyPage.expectReadableWithoutJavaScript();
  await publicDiscoveryPage.expectRobotsAndSitemap();
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

test("the published recursion lesson stays readable across runtimes", async ({
  browserSession,
  noJavaScriptTopicLessonPage,
  topicLessonPage,
}) => {
  await browserSession.useDesktopViewport();
  await topicLessonPage.open();
  await topicLessonPage.expectPublishedLesson();
  await topicLessonPage.expectDesktopComposition();
  await browserSession.captureViewport("recursion-lesson-desktop.png");
  await topicLessonPage.expectPracticeSolutions();
  await topicLessonPage.expectProgressClosureJourney();
  await browserSession.captureViewport("recursion-practice-solved.png");
  await topicLessonPage.expectNoHorizontalOverflow();
  await topicLessonPage.expectStableReload();
  await topicLessonPage.expectReadingPosition();

  await browserSession.useZoomedDesktopViewport();
  await topicLessonPage.open();
  await topicLessonPage.expectPublishedLesson();
  await topicLessonPage.expectNoHorizontalOverflow();

  await browserSession.useNarrowViewport();
  await topicLessonPage.open();
  await browserSession.captureViewport("recursion-lesson-mobile.png");
  await topicLessonPage.expectPublishedLesson();
  await topicLessonPage.expectMobileComposition();
  await topicLessonPage.expectNoHorizontalOverflow();
  browserSession.expectCleanConsole();

  await noJavaScriptTopicLessonPage.expectReadableWithoutJavaScript();
  await topicLessonPage.expectDirectEntryBackFallback();
  await topicLessonPage.expectInternalBackNavigation();
  await topicLessonPage.expectUnknownLessonNotFound();
});

test("the published task-5 lesson stays discoverable and complete", async ({
  browserSession,
  foundationPage,
  noJavaScriptNumberRecordLessonPage,
  numberRecordLessonPage,
  publicDiscoveryPage,
}) => {
  await browserSession.useDesktopViewport();
  await numberRecordLessonPage.open();
  await numberRecordLessonPage.expectPublishedNumberRecordLesson();
  await numberRecordLessonPage.expectKeyboardHelpDisclosures();
  await numberRecordLessonPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("task-5-published-lesson-desktop.png");

  await browserSession.useZoomedDesktopViewport();
  await numberRecordLessonPage.open();
  await numberRecordLessonPage.expectPublishedNumberRecordLesson();
  await numberRecordLessonPage.expectNoHorizontalOverflow();

  await browserSession.useNarrowViewport();
  await numberRecordLessonPage.open();
  await numberRecordLessonPage.expectPublishedNumberRecordLesson();
  await numberRecordLessonPage.expectMobileComposition();
  await numberRecordLessonPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("task-5-published-lesson-mobile.png");
  browserSession.expectCleanConsole();

  await noJavaScriptNumberRecordLessonPage.expectPublishedNumberRecordLessonReadableWithoutJavaScript();

  await foundationPage.open();
  await foundationPage.expectPublishedMaterial();
  await publicDiscoveryPage.expectRobotsAndSitemap();
});
