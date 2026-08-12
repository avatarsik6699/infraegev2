import { clientEnv } from "~/shared/config/client-env";
import type { Task } from "~/entities/content";

export type CheckAnswerResponse = {
  correct: boolean;
  explanation: Task["explanation"];
};

function isCheckAnswerResponse(value: unknown): value is CheckAnswerResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CheckAnswerResponse).correct === "boolean" &&
    Array.isArray((value as CheckAnswerResponse).explanation)
  );
}

export async function checkAnswer(
  taskId: string,
  answer: string,
): Promise<CheckAnswerResponse> {
  const response = await fetch(
    `${clientEnv.apiBasePath}/tasks/${encodeURIComponent(taskId)}/check`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) {
    throw new Error(`Answer check failed with HTTP ${response.status}`);
  }
  const body: unknown = await response.json();
  if (!isCheckAnswerResponse(body)) {
    throw new Error("Malformed /tasks/:id/check response");
  }
  return body;
}
