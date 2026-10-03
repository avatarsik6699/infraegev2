import { apiClient } from "~/shared/api";

export type NextBankTask = { id: string; title: string; examNumbers: number[] };

/** The bank task after `afterId` in the default catalog order, with its title. */
export const getNextBankTask = async (
  afterId: string,
  signal: AbortSignal,
): Promise<NextBankTask | null> => {
  const timed = AbortSignal.any([signal, AbortSignal.timeout(6000)]);
  const next = await apiClient.GET("/api/tasks/{task_id}/next", {
    params: { path: { task_id: afterId } },
    signal: timed,
    cache: "no-store",
  });
  const id = next.response.ok ? next.data?.task_id : null;
  if (!id) return null;
  const detail = await apiClient.GET("/api/tasks/{task_id}", {
    params: { path: { task_id: id } },
    signal: timed,
    cache: "no-store",
  });
  if (!detail.response.ok || !detail.data) return null;
  return {
    id,
    title: detail.data.content.title,
    examNumbers: detail.data.content.exam_numbers ?? [],
  };
};
