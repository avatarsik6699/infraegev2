import { contentFiles } from "~/shared/lib/content-files";
import type { PracticeTaskTypes } from "../practice-task.types";

type TaskSource = {
  id: string;
  title: string;
  statement: string;
  hint: string;
  theory_links: PracticeTaskTypes.TheoryLink[];
  difficulty: number;
  explanation: unknown[];
};

export async function loadPracticeTasks(
  taskIds: readonly string[],
): Promise<PracticeTaskTypes.Task[]> {
  return Promise.all(taskIds.map(loadPracticeTask));
}

async function loadPracticeTask(
  taskId: string,
): Promise<PracticeTaskTypes.Task> {
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
  const source = JSON.parse(value) as unknown;
  if (!isRecord(source)) {
    throw new Error("Invalid public task projection");
  }

  const theoryLinks = requireArray(source.theory_links);
  if (!theoryLinks.every(isTheoryLink)) {
    throw new Error("Invalid public task projection");
  }

  return {
    id: requireString(source.id),
    title: requireString(source.title),
    statement: requireString(source.statement),
    hint: requireString(source.hint),
    difficulty: requireNumber(source.difficulty),
    explanation: requireArray(source.explanation),
    theory_links: theoryLinks,
  };
}

function parseSolutionBlock(value: unknown): PracticeTaskTypes.SolutionBlock {
  if (
    !isRecord(value) ||
    typeof value.type !== "string" ||
    !isRecord(value.data)
  ) {
    throw new Error("Invalid practice solution block");
  }

  const parser = solutionBlockParsers[value.type];
  if (!parser) {
    throw new Error("Unsupported practice solution block");
  }
  return parser(value.data);
}

const solutionBlockParsers: Record<
  string,
  (data: Record<string, unknown>) => PracticeTaskTypes.SolutionBlock
> = {
  text: parseTextBlock,
  callout: parseCalloutBlock,
  worked_example: parseStepsBlock,
  completion_exercise: parseStepsBlock,
  productive_failure_prompt: parseStepsBlock,
  code_example: parseCodeBlock,
};

function parseTextBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.SolutionBlock {
  return { type: "text", text: requireSolutionString(data.markdown) };
}

function parseCalloutBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.SolutionBlock {
  if (data.tone !== "info" && data.tone !== "warning") {
    throw new Error("Unsupported practice solution block");
  }
  return {
    type: "callout",
    tone: data.tone === "info" ? "idea" : "warning",
    text: requireSolutionString(data.markdown),
  };
}

function parseStepsBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.SolutionBlock {
  const steps = data.steps;
  if (!Array.isArray(steps) || !steps.every(isString)) {
    throw new Error("Unsupported practice solution block");
  }
  return {
    type: "steps",
    prompt: requireSolutionString(data.prompt),
    steps,
  };
}

function parseCodeBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.SolutionBlock {
  const caption = data.caption;
  if (
    caption !== undefined &&
    caption !== null &&
    typeof caption !== "string"
  ) {
    throw new Error("Unsupported practice solution block");
  }
  return {
    type: "code",
    language:
      requireSolutionString(data.language) === "python" ? "python" : "text",
    code: requireSolutionString(data.code),
    ...(typeof caption === "string" ? { caption } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTheoryLink(value: unknown): value is PracticeTaskTypes.TheoryLink {
  return (
    typeof value === "object" &&
    value !== null &&
    "hash" in value &&
    typeof value.hash === "string" &&
    "label" in value &&
    typeof value.label === "string"
  );
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function requireString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Invalid public task projection");
  }
  return value;
}

function requireNumber(value: unknown): number {
  if (typeof value !== "number") {
    throw new Error("Invalid public task projection");
  }
  return value;
}

function requireArray(value: unknown): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid public task projection");
  }
  return value;
}

function requireSolutionString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Unsupported practice solution block");
  }
  return value;
}

function difficultyLabel(difficulty: number): string {
  if (difficulty <= 1) return "Базовая";
  if (difficulty === 2) return "Средняя";
  return "Высокая";
}
