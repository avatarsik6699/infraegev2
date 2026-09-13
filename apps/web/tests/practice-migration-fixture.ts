import { readFile } from "node:fs/promises";
import path from "node:path";
import snapshot from "../../../content/practice-migration/snapshot.json";
import { projectPracticeTask } from "~/entities/practice-task/api/load-practice-tasks.server";
import type { components } from "~/shared/api/schema";

export function migrationTaskIds(lessonId: string | undefined): string[] {
  return (
    snapshot.materials.find((material) => material.id === lessonId)?.task_ids ??
    []
  );
}

export async function loadMigrationPractice(taskIds: readonly string[]) {
  return Promise.all(
    taskIds.map(async (id) => {
      const source = JSON.parse(
        await readFile(
          path.resolve(
            process.cwd(),
            `../../content/practice-migration/tasks/${id}.json`,
          ),
          "utf8",
        ),
      ) as Record<string, unknown>;
      const material = snapshot.materials.find((lesson) =>
        lesson.task_ids.includes(id),
      );
      const content = Object.fromEntries(
        ["id", "title", "statement", "hint", "explanation", "difficulty"].map(
          (key) => [key, source[key]],
        ),
      );
      const links = source.theory_links;
      const publicTask = {
        id,
        revision: 1,
        solution_revision: 1,
        content: {
          ...content,
          answer_instruction: "Введите ответ",
          sources: [],
          files: [],
          lessons: [],
          theory_links: (links as { hash: string; label: string }[]).map(
            (link) => ({
              material_id: material?.id,
              section: link.hash,
              label: link.label,
            }),
          ),
        },
        deliveries: [],
      } as unknown as components["schemas"]["PublicTask"];
      for (const area of ["statement", "hint", "explanation"] as const) {
        publicTask.content[area] = publicTask.content[area].map(
          (block, index) => {
            if (block.type !== "attachment") return block;
            const data = block.data as unknown as {
              label: string;
              description: string;
              src: string;
              mime_type: string;
              size_bytes: number;
            };
            const usageId = `${area}-${String(index)}`;
            publicTask.content.files?.push({
              id: usageId,
              checksum: "0".repeat(64),
              purpose: "attachment",
              filename: data.label,
              description: data.description,
            });
            publicTask.deliveries?.push({
              usage_id: usageId,
              url: `/api/tasks/${id}/files/${usageId}`,
              mime_type: data.mime_type,
              size_bytes: data.size_bytes,
            });
            return { type: "attachment", data: { usage_id: usageId } };
          },
        );
      }
      return projectPracticeTask(publicTask, material?.id ?? "");
    }),
  );
}
