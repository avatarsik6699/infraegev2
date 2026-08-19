import { contentFiles } from "~/shared/lib/content-files";
import type { LessonTypes } from "../lesson.types";

type TaskSource = {
  id: string;
  title: string;
  statement: string;
  hint: string;
  theory_links: LessonTypes.TheoryLink[];
  difficulty: number;
  explanation: unknown[];
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
    solution: source.explanation.map(parseSolutionBlock),
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
    !("explanation" in source) ||
    !Array.isArray(source.explanation) ||
    !("theory_links" in source) ||
    !Array.isArray(source.theory_links) ||
    !source.theory_links.every(isTheoryLink)
  ) {
    throw new Error("Invalid public task projection");
  }
  return source as TaskSource;
}

function parseSolutionBlock(value: unknown): LessonTypes.PracticeSolutionBlock {
  if (
    !isRecord(value) ||
    typeof value.type !== "string" ||
    !isRecord(value.data)
  ) {
    throw new Error("Invalid practice solution block");
  }
  if (value.type === "text" && typeof value.data.markdown === "string") {
    return { type: "text", text: value.data.markdown };
  }
  if (
    value.type === "callout" &&
    (value.data.tone === "info" || value.data.tone === "warning") &&
    typeof value.data.markdown === "string"
  ) {
    return {
      type: "callout",
      tone: value.data.tone === "info" ? "idea" : "warning",
      text: value.data.markdown,
    };
  }
  if (
    (value.type === "worked_example" ||
      value.type === "completion_exercise" ||
      value.type === "productive_failure_prompt") &&
    typeof value.data.prompt === "string" &&
    Array.isArray(value.data.steps) &&
    value.data.steps.every((step) => typeof step === "string")
  ) {
    return {
      type: "steps",
      prompt: value.data.prompt,
      steps: value.data.steps,
    };
  }
  if (
    value.type === "code_example" &&
    typeof value.data.language === "string" &&
    typeof value.data.code === "string" &&
    (value.data.caption === undefined ||
      value.data.caption === null ||
      typeof value.data.caption === "string")
  ) {
    return {
      type: "code",
      language: value.data.language === "python" ? "python" : "text",
      code: value.data.code,
      ...(typeof value.data.caption === "string"
        ? { caption: value.data.caption }
        : {}),
    };
  }
  throw new Error("Unsupported practice solution block");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
