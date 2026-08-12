import {
  apiClient,
  ApiError,
  normalizeApiFailure,
  type components,
} from "~/shared/api";

export type CheckAnswerResponse = components["schemas"]["CheckResponse"];

export async function checkAnswer(
  taskId: string,
  answer: string,
): Promise<CheckAnswerResponse> {
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
    return data;
  } catch (error) {
    throw normalizeApiFailure(error);
  }
}
