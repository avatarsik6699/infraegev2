import type { components } from "~/shared/api/schema";
import type { PracticeCatalogTypes } from "../practice-catalog.types";
import { projectPracticeTask } from "./load-practice-tasks.server";
import { practiceServerClient } from "./practice-server-client.server";

export async function loadPracticeCatalog(search: PracticeCatalogTypes.Search) {
  if (search.invalid) return { status: "invalid" as const, page: null };
  try {
    const query = {
      skill: search.skill,
      exam_number: search.exam_number,
      difficulty: search.difficulty,
      cursor: search.cursor,
    };
    const result = await practiceServerClient.GET("/api/tasks", {
      params: { query },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (result.response.status === 422)
      return { status: "invalid" as const, page: null };
    if (!result.response.ok || !result.data)
      throw new Error("Practice unavailable");
    return {
      status: "ready" as const,
      page: result.data,
    };
  } catch {
    return { status: "unavailable" as const, page: null };
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
      },
    };
  } catch {
    return { status: "unavailable" as const, detail: null };
  }
}
