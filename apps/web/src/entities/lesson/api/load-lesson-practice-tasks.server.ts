import { contentFiles } from "~/shared/lib/content-files";
import type { LessonTypes } from "../lesson.types";

type TaskSource = {
  id: string;
  title: string;
  statement: string;
  hint: string;
  theory_links: LessonTypes.TheoryLink[];
  difficulty: number;
};

export async function loadLessonPracticeTasks(
  taskIds: readonly string[],
): Promise<LessonTypes.PracticeTask[]> {
  return Promise.all(taskIds.map(loadPracticeTask));
}

async function loadPracticeTask(
  taskId: string,
): Promise<LessonTypes.PracticeTask> {
  const source = parseTaskSource(await contentFiles.readTask(taskId));
  if (source.id !== taskId) {
    throw new Error(`Task id mismatch for ${taskId}`);
  }
  return {
    id: source.id,
    title: source.title,
    statement: source.statement,
    hint: source.hint,
    theoryLinks: source.theory_links,
    difficultyLabel: difficultyLabel(source.difficulty),
  };
}

function parseTaskSource(value: string): TaskSource {
  const source: unknown = JSON.parse(value);
  if (
    typeof source !== "object" ||
    source === null ||
    !("id" in source) ||
    typeof source.id !== "string" ||
    !("title" in source) ||
    typeof source.title !== "string" ||
    !("statement" in source) ||
    typeof source.statement !== "string" ||
    !("hint" in source) ||
    typeof source.hint !== "string" ||
    !("difficulty" in source) ||
    typeof source.difficulty !== "number" ||
    !("theory_links" in source) ||
    !Array.isArray(source.theory_links) ||
    !source.theory_links.every(isTheoryLink)
  ) {
    throw new Error("Invalid public task projection");
  }
  return source as TaskSource;
}

function isTheoryLink(value: unknown): value is LessonTypes.TheoryLink {
  return (
    typeof value === "object" &&
    value !== null &&
    "hash" in value &&
    typeof value.hash === "string" &&
    "label" in value &&
    typeof value.label === "string"
  );
}

function difficultyLabel(difficulty: number): string {
  if (difficulty <= 1) return "Базовая";
  if (difficulty === 2) return "Средняя";
  return "Высокая";
}
