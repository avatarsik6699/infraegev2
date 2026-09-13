import { test } from "./fixtures";

test("slow checker keeps one in-flight answer", async ({
  practiceCutoverPage,
}) => {
  await practiceCutoverPage.openTopic();
  await practiceCutoverPage.expectSlowCheckPreventsDuplicateSubmission();
});

test("stale task requires explicit refresh and retains the answer", async ({
  practiceCutoverPage,
}) => {
  await practiceCutoverPage.openTopic();
  await practiceCutoverPage.expectStaleRefreshPreservesInput();
});

test("network failure retains input and supports retry", async ({
  practiceCutoverPage,
}) => {
  await practiceCutoverPage.openTopic();
  await practiceCutoverPage.expectFailedCheckPreservesInput();
});

test("legacy Python progress agrees in lesson, overview and catalog", async ({
  practiceCutoverPage,
}) => {
  await practiceCutoverPage.expectPythonAndCourseProgress();
});

test("mobile no-JS retains practice and hides checker data", async ({
  noJavaScriptPracticeCutoverPage,
}) => {
  await noJavaScriptPracticeCutoverPage.openTopic();
  await noJavaScriptPracticeCutoverPage.expectNoJavaScriptPractice();
});
