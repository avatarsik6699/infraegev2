import type { components } from "~/shared/api/schema";
import type { PracticeCatalogTypes } from "../practice-catalog.types";
import { projectPracticeTask } from "./load-practice-tasks.server";
import { practiceServerClient } from "./practice-server-client.server";

export async function loadPracticeCatalog(search: PracticeCatalogTypes.Search) {
  if (search.invalid)
    return { status: "invalid" as const, page: null, facets: null };
  try {
    const query = {
      skill: search.skill,
      exam_number: search.exam_number,
      difficulty: search.difficulty,
      page: search.page,
    };
    const result = await practiceServerClient.GET("/api/tasks", {
      params: { query },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (result.response.status === 422)
      return { status: "invalid" as const, page: null, facets: null };
    if (!result.response.ok || !result.data)
      throw new Error("Practice unavailable");
    const facets = await practiceServerClient.GET("/api/tasks/facets", {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!facets.response.ok || !facets.data)
      throw new Error("Practice facets unavailable");
    return { status: "ready" as const, page: result.data, facets: facets.data };
  } catch {
    return { status: "unavailable" as const, page: null, facets: null };
  }
}

export async function loadStandaloneTask(id: string) {
  try {
    const result = await practiceServerClient.GET("/api/tasks/{task_id}", {
      params: { path: { task_id: id } },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (result.response.status === 404)
      return { status: "missing" as const, detail: null };
    if (!result.response.ok || !result.data)
      throw new Error("Practice unavailable");
    const raw: components["schemas"]["PublicTask"] = result.data;
    return {
      status: "ready" as const,
      detail: {
        task: projectPracticeTask(raw, ""),
        sources: raw.content.sources,
        theoryLinks: raw.content.theory_links,
        catalogVisible: raw.content.catalog_visible,
        answerInstruction: raw.content.answer_instruction,
        examNumbers: raw.content.exam_numbers ?? [],
        estimatedMinutes: raw.content.estimated_minutes,
      },
    };
  } catch {
    return { status: "unavailable" as const, detail: null };
  }
}

export async function loadNextPracticeTask(
  id: string,
  search: PracticeCatalogTypes.Search,
) {
  try {
    const result = await practiceServerClient.GET("/api/tasks/{task_id}/next", {
      params: {
        path: { task_id: id },
        query: {
          skill: search.skill,
          exam_number: search.exam_number,
          difficulty: search.difficulty,
        },
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!result.response.ok || !result.data)
      throw new Error("Continuation unavailable");
    return { status: "ready" as const, taskId: result.data.task_id };
  } catch {
    return { status: "unavailable" as const, taskId: null };
  }
}
