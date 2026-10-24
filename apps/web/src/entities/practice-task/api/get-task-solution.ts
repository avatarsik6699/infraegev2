import { createServerFn } from "@tanstack/react-start";
import { loadTaskSolution } from "./server-loaders";

/** Change 198: «Решение» of a paid task loads it on request, with the session. */
export const getTaskSolution = createServerFn({ method: "GET" })
  .validator((taskId: string) => taskId)
  .handler(({ data }) => loadTaskSolution(data));
