import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  loadTask,
  loadTopic,
  resolveContentLink,
  parseTopicRouteSlug,
} from "~/entities/content";
import { TopicPage } from "~/pages/topic";

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
  component: TopicRoute,
});

function TopicRoute() {
  const { topic, tasks, prerequisites, related } = Route.useLoaderData();
  return (
    <TopicPage
      topic={topic}
      tasks={tasks}
      prerequisites={prerequisites}
      related={related}
    />
  );
}
