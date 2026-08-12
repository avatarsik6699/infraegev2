import { createFileRoute, isNotFound, notFound } from "@tanstack/react-router";
import {
  loadTask,
  loadTopic,
  isContentNotFoundError,
  resolveContentLink,
  parseTopicRouteSlug,
} from "~/entities/content";
import { TopicPage } from "~/pages/topic";

export const Route = createFileRoute("/theory/$topicSlug")({
  loader: async ({ params }) => {
    try {
      const { taskNumber, topicId } = parseTopicRouteSlug(params.topicSlug);
      const topic = await loadTopic({ data: topicId });
      if (!topic.task_numbers.includes(taskNumber)) {
        throw notFound();
      }
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
    } catch (error) {
      if (isNotFound(error) || isContentNotFoundError(error)) {
        throw notFound();
      }
      throw error instanceof Error
        ? error
        : new Error("Unexpected topic loader failure");
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
