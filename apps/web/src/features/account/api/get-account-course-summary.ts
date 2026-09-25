import { createServerFn } from "@tanstack/react-start";
import { loadCoursePracticeSummary } from "~/entities/practice-task";

export const getAccountCourseSummary = createServerFn({
  method: "GET",
}).handler(() => loadCoursePracticeSummary("python"));
