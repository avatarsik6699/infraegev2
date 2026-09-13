import { createServerFn } from "@tanstack/react-start";
import { courseCatalog } from "~/entities/course";
import { loadCoursePracticeSummary } from "~/entities/practice-task";

export const getCatalogPracticeSummaries = createServerFn({
  method: "GET",
}).handler(async () =>
  Object.fromEntries(
    await Promise.all(
      courseCatalog.entries
        .filter((course) => course.status === "published")
        .map(
          async (course) =>
            [course.id, await loadCoursePracticeSummary(course.id)] as const,
        ),
    ),
  ),
);
