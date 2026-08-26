import { createServerFn } from "@tanstack/react-start";
import { loadPracticeTasks } from "./load-practice-tasks.server";

export const getPracticeTasksRouteData = createServerFn({ method: "GET" })
  .validator((taskIds: readonly string[]) => taskIds)
  .handler(async ({ data: taskIds }: { data: readonly string[] }) => ({
    tasks: await loadPracticeTasks(taskIds),
  }));
