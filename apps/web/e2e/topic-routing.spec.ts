import { test } from "./fixtures";

test("topic routes redirect legacy section links to their owning subtopic", async ({
  topicLessonPage,
}) => {
  await topicLessonPage.expectLegacySectionRedirect();
});

test("published subtopic remains readable without JavaScript @no-js", async ({
  noJavaScriptTopicLessonPage,
}) => {
  await noJavaScriptTopicLessonPage.expectNoJavaScriptSubtopic();
});
