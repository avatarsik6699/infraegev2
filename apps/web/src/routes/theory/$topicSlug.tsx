import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentBlockList } from "~/components/content-blocks/ContentBlockRenderer";
import { PracticeTaskWidget } from "~/components/PracticeTaskWidget";
import { PrerequisiteCallout } from "~/components/PrerequisiteCallout";
import {
  loadTask,
  loadTopic,
  resolveContentLink,
} from "~/content/server-loaders";
import { parseTopicRouteSlug } from "~/content/loader";

export const Route = createFileRoute("/theory/$topicSlug")({
  loader: async ({ params }) => {
    const { topicId } = parseTopicRouteSlug(params.topicSlug);
    try {
      const topic = await loadTopic({ data: topicId });
      const tasks = await Promise.all(
        topic.practice_task_ids.map((id) => loadTask({ data: id })),
      );
      const prerequisites = (
        await Promise.all(
          topic.prerequisites.map((id) => resolveContentLink({ data: id })),
        )
      ).filter((link) => link !== null);
      const related = (
        await Promise.all(
          topic.related_topics.map((id) => resolveContentLink({ data: id })),
        )
      ).filter((link) => link !== null);
      return { topic, tasks, prerequisites, related };
    } catch {
      // Any load failure here (missing topic/task file, unresolvable link) means the requested
      // content doesn't exist — a 404, not a 500 (docs/SPEC.md §5.1).
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.topic.title },
          { name: "description", content: loaderData.topic.summary },
          { property: "og:title", content: loaderData.topic.title },
          { property: "og:description", content: loaderData.topic.summary },
        ]
      : [],
  }),
  component: TopicPage,
});

function TopicPage() {
  const { topic, tasks, prerequisites, related } = Route.useLoaderData();

  return (
    <main className="container">
      <span className="task-badge">№{topic.task_numbers[0]}</span>
      <h1>{topic.title}</h1>

      <PrerequisiteCallout
        heading="Эта тема легче даётся, если понимать:"
        links={prerequisites}
      />

      <ContentBlockList blocks={topic.content_blocks} />

      <h2>Практика</h2>
      {tasks.map((task) => (
        <PracticeTaskWidget key={task.id} task={task} />
      ))}

      <PrerequisiteCallout heading="Связанные темы:" links={related} />
    </main>
  );
}
