import { test } from "./fixtures";

test("topic 25 «Делители и маски» is readable with its new lesson blocks", async ({
  divisorsAndMasksLessonPage,
  browserSession,
}) => {
  await divisorsAndMasksLessonPage.open();
  await divisorsAndMasksLessonPage.expectPublishedDivisorsAndMasksContent();
  await divisorsAndMasksLessonPage.expectStudyNavigationAndAccessibility();
  await divisorsAndMasksLessonPage.expectCodeKeyboardFocus(
    "Код на Python: def has_k_divisors(n, k):",
  );
  browserSession.expectCleanConsole();
});

test("topic 25 steps by hand only under reduced motion", async ({
  divisorsAndMasksLessonPage,
}) => {
  await divisorsAndMasksLessonPage.expectStepperRespectsReducedMotion();
});

test("topic 25 remains usable without JavaScript", async ({
  noJavaScriptDivisorsAndMasksLessonPage,
}) => {
  await noJavaScriptDivisorsAndMasksLessonPage.open();
  await noJavaScriptDivisorsAndMasksLessonPage.expectPublishedDivisorsAndMasksContent(
    true,
  );
});
