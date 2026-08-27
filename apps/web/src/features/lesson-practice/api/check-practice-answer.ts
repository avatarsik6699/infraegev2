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
  if (block.type === "text" || block.type === "callout")
    return block.data.markdown;
  if (
    block.type === "worked_example" ||
    block.type === "completion_exercise" ||
    block.type === "productive_failure_prompt"
  ) {
    return `${block.data.prompt} ${block.data.steps.join(" ")}`;
  }
  if (block.type === "code_example")
    return block.data.caption ?? "Разбор приведён в коде.";
  if (block.type === "learning_visual") return block.data.caption;
  if (block.type === "video_embed") return block.data.title;
  return "";
}
