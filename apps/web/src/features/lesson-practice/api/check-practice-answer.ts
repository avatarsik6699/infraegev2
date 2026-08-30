import type { PracticeTaskTypes } from "~/entities/practice-task";
import { apiClient, ApiError, normalizeApiFailure } from "~/shared/api";
import type { components } from "~/shared/api/schema";

type ExplanationBlock =
  components["schemas"]["CheckResponse"]["explanation"][number];

export const checkPracticeAnswer: PracticeTaskTypes.Checker = async (
  taskId,
  answer,
) => {
  try {
    const { data, response } = await apiClient.POST(
      "/api/tasks/{task_id}/check",
      {
        params: { path: { task_id: taskId } },
        body: { answer },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) {
      throw new ApiError("http", "Answer check returned an HTTP error", {
        status: response.status,
      });
    }
    if (!data) {
      throw new ApiError("protocol", "Answer check response had no data");
    }
    return {
      correct: data.correct,
      explanation: data.explanation
        .map(explanationText)
        .filter(Boolean)
        .join(" "),
    };
  } catch (error) {
    throw normalizeApiFailure(error);
  }
};

function explanationText(block: ExplanationBlock): string {
  const { data } = block;
  if ("markdown" in data) return data.markdown;
  if ("steps" in data) return `${data.prompt} ${data.steps.join(" ")}`;
  if ("title" in data) return data.title;
  if ("caption" in data) return data.caption ?? "Разбор приведён в коде.";
  return "";
}
