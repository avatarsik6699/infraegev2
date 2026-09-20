import type { components } from "~/shared/api/schema";
import { apiClient } from "~/shared/api";
import type { TopicCatalogPageTypes } from "../topic-catalog-page.types";

export const getTopicPracticeSummary = async (
  signal: AbortSignal,
): Promise<TopicCatalogPageTypes.Summary> => {
  const result = await apiClient.GET("/api/topics/practice-summary", {
    signal: AbortSignal.any([signal, AbortSignal.timeout(6000)]),
    cache: "no-store",
  });
  if (!result.response.ok || !result.data)
    throw new Error("Practice unavailable");
  return result.data.topics.map(
    (topic: components["schemas"]["LessonSummary"]) => ({
      id: topic.id,
      tasks: topic.tasks.map((task: components["schemas"]["TaskVersion"]) => ({
        id: task.id,
        solutionRevision: task.solution_revision,
      })),
    }),
  );
};
