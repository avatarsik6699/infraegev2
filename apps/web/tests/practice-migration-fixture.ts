import bankJson from "../../../content/practice-bank/bank.json";
import { projectPracticeTask } from "~/entities/practice-task/api/load-practice-tasks.server";
import type { components } from "~/shared/api/schema";

type BankTask = {
  id: string;
  lessons: { material_id: string; position: number }[];
  sources: ({ is_public: boolean } & Record<string, unknown>)[];
  files: { id: string; checksum: string }[];
  checker: unknown;
} & Record<string, unknown>;

/** The fields of the practice bank this fixture reads. The file has grown past the size
 * up to which TypeScript infers a JSON module's type, so the import is typed here. */
const bank = bankJson as unknown as {
  tasks: { solution_revision: number; task: BankTask }[];
  files: { checksum: string; mime_type: string; size_bytes: number }[];
};

export function migrationTaskIds(lessonId: string | undefined): string[] {
  return bank.tasks
    .filter(({ task }) =>
      task.lessons.some((link) => link.material_id === lessonId),
    )
    .sort(
      (a, b) =>
        a.task.lessons.find((link) => link.material_id === lessonId)!.position -
        b.task.lessons.find((link) => link.material_id === lessonId)!.position,
    )
    .map(({ task }) => task.id);
}

export async function loadMigrationPractice(taskIds: readonly string[]) {
  return taskIds.map((id) => {
    const entry = bank.tasks.find(({ task }) => task.id === id);
    if (!entry) throw new Error(`Missing fixture task ${id}`);
    const { checker: _checker, sources, ...content } = entry.task;
    void _checker;
    const publicTask = {
      id,
      revision: entry.solution_revision,
      solution_revision: entry.solution_revision,
      content: {
        ...content,
        sources: sources
          .filter((source) => source.is_public)
          .map(({ is_public: _private, ...source }) => {
            void _private;
            return source;
          }),
      },
      deliveries: content.files.map((usage) => {
        const file = bank.files.find(
          (file) => file.checksum === usage.checksum,
        )!;
        return {
          usage_id: usage.id,
          url: `/api/tasks/${id}/files/${usage.id}`,
          mime_type: file.mime_type,
          size_bytes: file.size_bytes,
        };
      }),
    } as components["schemas"]["PublicTask"];
    return projectPracticeTask(
      publicTask,
      content.lessons[0]?.material_id ?? "",
    );
  });
}
