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
  switch (block.type) {
    case "text":
    case "callout":
      return block.data.markdown;
    case "list":
      return block.data.items.join(" ");
    case "worked_example":
    case "completion_exercise":
    case "productive_failure_prompt":
      return `${block.data.prompt} ${block.data.steps.join(" ")}`;
    case "code_example":
      return block.data.caption ?? "Разбор приведён в коде.";
    case "table":
      return block.data.caption ?? "Сверьте промежуточные данные в таблице.";
    case "image":
    case "diagram":
      return block.data.caption;
    case "attachment":
      return `${block.data.label}: ${block.data.description}`;
  }
}
