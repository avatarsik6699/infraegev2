import { test } from "./fixtures";

test("topic routes redirect legacy section links to their owning subtopic", async ({
  topicLessonPage,
}) => {
  await topicLessonPage.expectLegacySectionRedirect(
    "dohodyat-do-bazy",
    "rekursivnaya-funktsiya",
    "Рекурсивная функция на Python",
  );
});

test("published subtopic remains readable without JavaScript @no-js", async ({
  noJavaScriptTopicLessonPage,
}) => {
  await noJavaScriptTopicLessonPage.expectNoJavaScriptSubtopic();
});
