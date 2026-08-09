import { env } from "~/shared/config/env";
import type { Task } from "~/entities/content";

export type CheckAnswerResponse = {
  correct: boolean;
  explanation: Task["explanation"];
};

function isCheckAnswerResponse(value: unknown): value is CheckAnswerResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CheckAnswerResponse).correct === "boolean"
  );
}

export async function checkAnswer(
  taskId: string,
  answer: string,
): Promise<CheckAnswerResponse> {
  const response = await fetch(
    `${env.client.apiBasePath}/tasks/${taskId}/check`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    },
  );
  const body: unknown = await response.json();
  if (!isCheckAnswerResponse(body)) {
    throw new Error("Malformed /tasks/:id/check response");
  }
  return body;
}
