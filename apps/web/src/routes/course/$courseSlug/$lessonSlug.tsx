import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentBlockList } from "~/components/content-blocks/ContentBlockRenderer";
import { PracticeTaskWidget } from "~/components/PracticeTaskWidget";
import {
  loadCourse,
  loadTask,
  resolveContentLink,
} from "~/content/server-loaders";

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
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.lesson.title} — ${loaderData.course.title}` }]
      : [],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lesson, tasks, unlocks } = Route.useLoaderData();

  return (
    <main className="container">
      <h1>{lesson.title}</h1>
      <ContentBlockList blocks={lesson.content_blocks} />

      <h2>Практика</h2>
      {tasks.map((task) => (
        <PracticeTaskWidget key={task.id} task={task} />
      ))}

      {unlocks.length > 0 && (
        <aside role="note">
          <p>Теперь ты готов к темам ЕГЭ:</p>
          <ul>
            {unlocks.map((link) => (
              <li key={link.id}>{link.title}</li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
}
