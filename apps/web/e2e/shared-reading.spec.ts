import { test } from "./fixtures";
import { lessonPublications } from "../src/shared/config/lesson-publication.mjs";
import { courseLessonPublications } from "../src/entities/course/content/course-publication.mjs";

const publishedLessons = [
  ...lessonPublications,
  ...courseLessonPublications,
].filter((lesson) => lesson.status === "published");

for (const [index, lesson] of publishedLessons.entries()) {
  test(`shared reading design: ${lesson.id}`, async ({
    minimalPage,
    browserSession,
  }) => {
    await minimalPage.expectUnifiedLesson(index);
    browserSession.expectCleanConsole();
  });

  test(`shared reading design without scripts: ${lesson.id} @no-js`, async ({
    noJavaScriptMinimalPage,
  }) => {
    await noJavaScriptMinimalPage.expectUnifiedLesson(index, true);
  });
}
