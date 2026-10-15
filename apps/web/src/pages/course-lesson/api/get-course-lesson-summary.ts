import { createServerFn } from "@tanstack/react-start";
import { loadCoursePracticeSummary } from "~/entities/practice-task";

/** Change 186 (F26): the course practice summary for the rail's mastered checks. */
export const getCourseLessonSummary = createServerFn({ method: "GET" })
  .validator((courseId: string) => courseId)
  .handler(({ data }) => loadCoursePracticeSummary(data));
