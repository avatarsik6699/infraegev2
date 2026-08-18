import { readFile } from "node:fs/promises";
import path from "node:path";
import { contentServerConfig } from "~/shared/config/content.server";

export const contentFiles = {
  readTask: (taskId: string) =>
    readFile(
      path.join(contentServerConfig.root, "tasks", `${taskId}.json`),
      "utf8",
    ),
} as const;
