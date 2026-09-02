import { test } from "./fixtures";

const finalProjectLessons = [
  ["spisok-del", "Добавляем дела и выводим список"],
  ["deystviya-so-spiskom", "Отмечаем выполненное, редактируем и удаляем"],
  ["sohranenie-spiska-del", "Сохраняем дела между запусками"],
  ["gotovaya-programma", "Проверяем весь сценарий и наводим порядок в коде"],
] as const;

for (const lessonIndex of Array.from({ length: 28 }, (_, index) => index)) {
  test(`Python curriculum lesson ${lessonIndex + 1} is public and SSR-readable`, async ({
    browserSession,
    noJavaScriptPythonCoursePage,
    pythonCoursePage,
  }) => {
    await browserSession.useDesktopViewport();
    await pythonCoursePage.expectPublishedCurriculumLesson(lessonIndex, {
      keyboard: true,
    });
    browserSession.expectCleanConsole();
    await noJavaScriptPythonCoursePage.expectPublishedCurriculumLesson(
      lessonIndex,
    );
  });
}

test("the Python course overview exposes the complete published path", async ({
  browserSession,
  noJavaScriptPythonCoursePage,
  pythonCoursePage,
}) => {
  await browserSession.useDesktopViewport();
  await pythonCoursePage.openOverview();
  await pythonCoursePage.dismissAnalyticsPrompt();
  await pythonCoursePage.expectCompleteOverview();
  await browserSession.captureViewport("python-course-published-desktop.png");

  await browserSession.useZoomedDesktopViewport();
  await pythonCoursePage.expectCompleteOverview();
  await browserSession.captureViewport("python-course-published-zoomed.png");

  await browserSession.useNarrowViewport();
  await pythonCoursePage.expectCompleteOverview();
  await browserSession.captureViewport("python-course-published-mobile.png");
  browserSession.expectCleanConsole();

  await pythonCoursePage.expectPublishedLessonsInPublicSitemap();
  await noJavaScriptPythonCoursePage.expectOverviewReadableWithoutJavaScript();
});

test("the published Python conditions lesson supports practice and target viewports", async ({
  browserSession,
  noJavaScriptPythonCoursePage,
  pythonCoursePage,
}) => {
  await browserSession.useDesktopViewport();
  await pythonCoursePage.openConditionsLesson();
  await pythonCoursePage.expectPublishedConditionsLesson();
  await pythonCoursePage.expectKeyboardDisclosures();
  await pythonCoursePage.expectConditionsPractice();
  await browserSession.captureViewport(
    "python-conditions-published-desktop.png",
  );

  await browserSession.useZoomedDesktopViewport();
  await pythonCoursePage.expectPublishedConditionsLesson();
  await browserSession.captureViewport(
    "python-conditions-published-zoomed.png",
  );

  await browserSession.useNarrowViewport();
  await pythonCoursePage.expectMobileReadingOrder();
  await browserSession.captureViewport(
    "python-conditions-published-mobile.png",
  );
  browserSession.expectCleanConsole();
  await noJavaScriptPythonCoursePage.expectConditionsReadableWithoutJavaScript();
});

test("the published Python errors lesson supports practice and target viewports", async ({
  browserSession,
  noJavaScriptPythonCoursePage,
  pythonCoursePage,
}) => {
  await browserSession.useDesktopViewport();
  await pythonCoursePage.openErrorsLesson();
  await pythonCoursePage.expectPublishedErrorsLesson();
  await pythonCoursePage.expectKeyboardDisclosures();
  await pythonCoursePage.expectErrorsPractice();
  await pythonCoursePage.expectSimplifiedErrorsResult();
  await browserSession.captureViewport("python-errors-published-desktop.png");

  await browserSession.useZoomedDesktopViewport();
  await pythonCoursePage.expectPublishedErrorsLesson();
  await browserSession.captureViewport("python-errors-published-zoomed.png");

  await browserSession.useNarrowViewport();
  await pythonCoursePage.expectMobileReadingOrder();
  await browserSession.captureViewport("python-errors-published-mobile.png");
  browserSession.expectCleanConsole();
  await noJavaScriptPythonCoursePage.expectErrorsReadableWithoutJavaScript();
});

test("the first published Python lesson preserves progress and reset", async ({
  browserSession,
  noJavaScriptPythonCoursePage,
  pythonCoursePage,
}) => {
  await browserSession.useDesktopViewport();
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
  await pythonCoursePage.expectMobileReadingOrder();
  await browserSession.captureViewport("python-first-program-zoomed.png");

  await browserSession.useNarrowViewport();
  await pythonCoursePage.expectMobileReadingOrder();
  await browserSession.captureViewport("python-first-program-mobile.png");
  browserSession.expectCleanConsole();
  await noJavaScriptPythonCoursePage.expectReadableWithoutJavaScript();
});

for (const [routeSlug, title] of finalProjectLessons) {
  test(`${title} is readable across target viewports`, async ({
    browserSession,
    noJavaScriptPythonCoursePage,
    pythonCoursePage,
  }) => {
    await browserSession.useDesktopViewport();
    await pythonCoursePage.openFinalProjectLesson(routeSlug, title);
    await pythonCoursePage.expectKeyboardDisclosures();
    await browserSession.captureViewport(`${routeSlug}-desktop.png`);

    await browserSession.useZoomedDesktopViewport();
    await pythonCoursePage.expectMobileReadingOrder();
    await browserSession.captureViewport(`${routeSlug}-zoomed.png`);

    await browserSession.useNarrowViewport();
    await pythonCoursePage.expectMobileReadingOrder();
    await browserSession.captureViewport(`${routeSlug}-mobile.png`);
    browserSession.expectCleanConsole();
    await noJavaScriptPythonCoursePage.openFinalProjectLesson(routeSlug, title);
  });
}

test("long public code is collapsible after hydration and complete without JavaScript", async ({
  browserSession,
  noJavaScriptPythonCoursePage,
  pythonCoursePage,
}) => {
  await browserSession.useDesktopViewport();
  await pythonCoursePage.openFinalProjectLesson(
    "gotovaya-programma",
    "Проверяем весь сценарий и наводим порядок в коде",
  );
  await pythonCoursePage.expectLongCodeDisclosure();
  browserSession.expectCleanConsole();

  await noJavaScriptPythonCoursePage.openFinalProjectLesson(
    "gotovaya-programma",
    "Проверяем весь сценарий и наводим порядок в коде",
  );
  await noJavaScriptPythonCoursePage.expectLongCodeReadableWithoutJavaScript();
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

test("the design-system catalog works on desktop and without JavaScript", async ({
  browserSession,
  designSystemLabPage,
  noJavaScriptDesignSystemLabPage,
}) => {
  await browserSession.useDesktopViewport();
  await designSystemLabPage.open();
  await designSystemLabPage.expectCatalogStructure({
    widgetPersistence: true,
  });
  await designSystemLabPage.expectUnlistedMetadata();
  await designSystemLabPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("design-system-lab-desktop.png");

  await browserSession.useZoomedDesktopViewport();
  await designSystemLabPage.open();
  await designSystemLabPage.expectCatalogStructure();
  await designSystemLabPage.expectNoHorizontalOverflow();
  await browserSession.captureViewport("design-system-lab-zoomed.png");
  browserSession.expectCleanConsole();

  await noJavaScriptDesignSystemLabPage.expectLinearContentWithoutJavaScript();
});

test("the published recursion lesson preserves practice and reading state", async ({
  browserSession,
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
  browserSession.expectCleanConsole();
});

test("the published recursion lesson stays readable across runtimes", async ({
  browserSession,
  noJavaScriptTopicLessonPage,
  topicLessonPage,
}) => {
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
