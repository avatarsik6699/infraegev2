import { createServerFn } from "@tanstack/react-start";
import { loadCoursePracticeSummary } from "~/entities/practice-task";

export const getCoursePracticeSummary = createServerFn({ method: "GET" })
  .validator((courseId: string) => courseId)
  .handler(({ data }) => loadCoursePracticeSummary(data));
