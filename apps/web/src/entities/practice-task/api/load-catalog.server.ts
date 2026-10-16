import type { components } from "~/shared/api/schema";
import type { PracticeCatalogTypes } from "../practice-catalog.types";
import { projectPracticeTask } from "./load-practice-tasks.server";
import { practiceServerClient } from "./practice-server-client.server";

export async function loadPracticeCatalog(search: PracticeCatalogTypes.Search) {
  if (search.invalid)
    return { status: "invalid" as const, page: null, facets: null };
  try {
    const query = {
      q: search.q,
      topics: search.topics,
      sort: search.sort,
      limit: search.limit,
      skill: search.skill,
      exam_number: search.exam_number,
      difficulty: search.difficulty,
      page: search.page,
    };
    // Change 191 (F1): the page and the filter facets are independent requests.
    const [result, facets] = await Promise.all([
      practiceServerClient.GET("/api/tasks", {
        params: { query },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      }),
      practiceServerClient.GET("/api/tasks/facets", {
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      }),
    ]);
    if (result.response.status === 422)
      return { status: "invalid" as const, page: null, facets: null };
    if (!result.response.ok || !result.data)
      throw new Error("Practice unavailable");
    if (!facets.response.ok || !facets.data)
      throw new Error("Practice facets unavailable");
    return { status: "ready" as const, page: result.data, facets: facets.data };
  } catch {
    return { status: "unavailable" as const, page: null, facets: null };
  }
}

/** Change 191 (F2): a few matching tasks and the total while the student types. */
export async function loadPracticeSuggestions(
  search: PracticeCatalogTypes.Search,
) {
  const q = search.q?.trim();
  if (search.invalid || !q || q.length < 2)
    return { status: "ready" as const, tasks: [], total: 0 };
  try {
    const result = await practiceServerClient.GET("/api/tasks/suggest", {
      params: {
        query: {
          q,
          topics: search.topics,
          skill: search.skill,
          exam_number: search.exam_number,
          difficulty: search.difficulty,
          sort: search.sort,
        },
      },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!result.response.ok || !result.data)
      throw new Error("Suggestions unavailable");
    return { status: "ready" as const, ...result.data };
  } catch {
    return { status: "unavailable" as const, tasks: [], total: 0 };
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
        difficulty: raw.content.difficulty,
        estimatedMinutes: raw.content.estimated_minutes,
      },
    };
  } catch {
    return { status: "unavailable" as const, detail: null };
  }
}
