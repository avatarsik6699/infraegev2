import { createServerOnlyFn } from "@tanstack/react-start";
import type { PracticeCatalogTypes } from "../practice-catalog.types";
import * as lessons from "./load-practice-tasks.server";
import * as catalog from "./load-catalog.server";
import * as discovery from "./load-discovery.server";

export const loadLessonPractice = createServerOnlyFn(
  (kind: "topic" | "course", id: string) =>
    lessons.loadLessonPractice(kind, id),
);
export const loadCoursePracticeSummary = createServerOnlyFn((id: string) =>
  lessons.loadCoursePracticeSummary(id),
);
export const loadPracticeCatalog = createServerOnlyFn(
  (search: PracticeCatalogTypes.Search) => catalog.loadPracticeCatalog(search),
);
export const loadStandaloneTask = createServerOnlyFn((id: string) =>
  catalog.loadStandaloneTask(id),
);
export const loadTaskSitemapIndex = createServerOnlyFn(() =>
  discovery.loadTaskSitemapIndex(),
);
export const loadTaskSitemapPage = createServerOnlyFn((page: number) =>
  discovery.loadTaskSitemapPage(page),
);
