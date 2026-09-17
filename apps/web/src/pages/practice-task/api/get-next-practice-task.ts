import { createServerFn } from "@tanstack/react-start";
import {
  loadNextPracticeTask,
  practiceCatalog,
} from "~/entities/practice-task";

export const getNextPracticeTask = createServerFn({ method: "GET" })
  .validator((data: { id: string; search: Record<string, unknown> }) => {
    if (!/^[a-z0-9][a-z0-9_-]{0,119}$/.test(data.id))
      throw new Error("Invalid task ID");
    return { id: data.id, search: practiceCatalog.search(data.search) };
  })
  .handler(({ data }) => loadNextPracticeTask(data.id, data.search));
