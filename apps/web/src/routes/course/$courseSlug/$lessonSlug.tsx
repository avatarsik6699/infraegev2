import { createFileRoute, isNotFound, notFound } from "@tanstack/react-router";
import {
  isContentNotFoundError,
  loadCourse,
  loadTask,
  resolveContentLink,
} from "~/entities/content";
import { LessonPage } from "~/pages/lesson";

export const Route = createFileRoute("/course/$courseSlug/$lessonSlug")({
  loader: async ({ params }) => {
    try {
      const course = await loadCourse({ data: params.courseSlug });
      const lesson = course.lessons.find((l) => l.id === params.lessonSlug);
      if (!lesson) throw notFound();
      const tasks = await Promise.all(
        lesson.practice_task_ids.map((id) => loadTask({ data: id })),
      );
      const unlocks = (
        await Promise.all(
          lesson.unlocks_topics.map((id) => resolveContentLink({ data: id })),
        )
      ).filter((l) => l !== null);
      return { course, lesson, tasks, unlocks };
    } catch (error) {
      if (isNotFound(error) || isContentNotFoundError(error)) {
        throw notFound();
      }
      throw error instanceof Error
        ? error
        : new Error("Unexpected lesson loader failure");
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.lesson.title} — ${loaderData.course.title}` }]
      : [],
  }),
  component: LessonRoute,
});

function LessonRoute() {
  const { lesson, tasks, unlocks } = Route.useLoaderData();
  return <LessonPage lesson={lesson} tasks={tasks} unlocks={unlocks} />;
}
