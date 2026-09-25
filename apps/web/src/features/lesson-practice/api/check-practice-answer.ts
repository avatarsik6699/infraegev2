import type { PracticeTaskTypes } from "~/entities/practice-task";
import { apiClient, ApiError, normalizeApiFailure } from "~/shared/api";
import type { components } from "~/shared/api/schema";

type ExplanationBlock =
  components["schemas"]["CheckResponse"]["explanation"][number];

export const STANDALONE_CONTEXT_ID = "standalone";

export const checkPracticeAnswer: PracticeTaskTypes.Checker = async (
  taskId,
  answer,
  solutionRevision,
) => {
  try {
    const { data, response } = await apiClient.POST(
      "/api/tasks/{task_id}/check",
      {
        params: { path: { task_id: taskId } },
        body: { answer, solution_revision: solutionRevision },
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
    if (data.solution_revision !== solutionRevision)
      throw new ApiError("protocol", "Checker revision mismatch");
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

export function createCheckAndSaveAnswer(
  contextKind: "topic_lesson" | "course_lesson" | "standalone",
  contextId: string,
  csrfToken: string | null,
): PracticeTaskTypes.Checker {
  return async (taskId, answer, solutionRevision) => {
    try {
      const { data, response } = await apiClient.POST(
        "/api/tasks/{task_id}/check-and-save",
        {
          params: { path: { task_id: taskId } },
          body: {
            answer,
            solution_revision: solutionRevision,
            context_kind: contextKind,
            context_id: contextId,
          },
          headers: { "x-csrf-token": csrfToken },
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (!response.ok || !data)
        throw new ApiError("http", "Saved answer returned an HTTP error", {
          status: response.status,
        });
      if (data.solution_revision !== solutionRevision)
        throw new ApiError("protocol", "Checker revision mismatch");
      return {
        correct: data.correct,
        saved: data.saved,
        explanation: data.explanation
          .map(explanationText)
          .filter(Boolean)
          .join(" "),
      };
    } catch (error) {
      throw normalizeApiFailure(error);
    }
  };
}

function explanationText(block: ExplanationBlock): string {
  switch (block.type) {
    case "rich_text":
      return block.data.spans.map((span) => span.text).join("");
    case "code_variants":
      return "Разбор приведён в коде.";
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
      return block.data.caption ?? "";
    case "attachment":
      return "Файл приведён в разборе.";
  }
}
