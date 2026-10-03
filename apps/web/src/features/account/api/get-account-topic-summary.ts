import { createServerFn } from "@tanstack/react-start";
import { loadTopicPracticeSummary } from "~/entities/practice-task";

export const getAccountTopicSummary = createServerFn({
  method: "GET",
}).handler(() => loadTopicPracticeSummary());
