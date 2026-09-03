import { contentFiles } from "~/shared/lib/content-files";
import type { PracticeTaskTypes } from "../practice-task.types";

type TaskSource = {
  id: string;
  title: string;
  statement: unknown[];
  hint: unknown[];
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
    statement: source.statement.map(parseContentBlock),
    hint: source.hint.map(parseContentBlock),
    theoryLinks: source.theory_links,
    difficultyLabel: difficultyLabel(source.difficulty),
    solution: source.explanation.map(parseContentBlock),
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
    statement: requireNonEmptyArray(source.statement),
    hint: requireNonEmptyArray(source.hint),
    difficulty: requireNumber(source.difficulty),
    explanation: requireNonEmptyArray(source.explanation),
    theory_links: theoryLinks,
  };
}

function parseContentBlock(value: unknown): PracticeTaskTypes.ContentBlock {
  if (
    !isRecord(value) ||
    typeof value.type !== "string" ||
    !isRecord(value.data)
  ) {
    throw new Error("Invalid practice content block");
  }
  requireOnlyKeys(value, ["type", "data"]);

  const parser = contentBlockParsers[value.type];
  if (!parser) {
    throw new Error("Unsupported practice content block");
  }
  return parser(value.data);
}

const contentBlockParsers: Record<
  string,
  (data: Record<string, unknown>) => PracticeTaskTypes.ContentBlock
> = {
  text: parseTextBlock,
  list: parseListBlock,
  callout: parseCalloutBlock,
  worked_example: parseStepsBlock,
  completion_exercise: parseStepsBlock,
  productive_failure_prompt: parseStepsBlock,
  code_example: parseCodeBlock,
  table: parseTableBlock,
  image: parseImageBlock,
  diagram: parseDiagramBlock,
  attachment: parseAttachmentBlock,
};

const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;

const attachmentMimeTypes = new Set<PracticeTaskTypes.AttachmentMimeType>([
  "text/plain",
  "text/csv",
  "application/json",
  "text/x-python",
  "application/zip",
]);

function parseTextBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, ["markdown"]);
  return { type: "text", text: requireSolutionString(data.markdown) };
}

function parseCalloutBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, ["tone", "markdown"]);
  if (data.tone !== "info" && data.tone !== "warning") {
    throw new Error("Unsupported practice content block");
  }
  return {
    type: "callout",
    tone: data.tone === "info" ? "idea" : "warning",
    text: requireSolutionString(data.markdown),
  };
}

function parseStepsBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, ["prompt", "steps"]);
  const steps = requireStringArray(data.steps);
  return {
    type: "steps",
    prompt: requireSolutionString(data.prompt),
    steps,
  };
}

function parseCodeBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, ["language", "code", "caption"]);
  const caption = data.caption;
  if (
    caption !== undefined &&
    caption !== null &&
    typeof caption !== "string"
  ) {
    throw new Error("Unsupported practice content block");
  }
  return {
    type: "code",
    language: requireLanguage(data.language),
    code: requireSolutionString(data.code),
    ...(typeof caption === "string" ? { caption } : {}),
  };
}

function parseListBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, ["style", "items"]);
  const items = requireStringArray(data.items);
  if (data.style !== "ordered" && data.style !== "unordered") {
    throw new Error("Unsupported practice content block");
  }
  return { type: "list", style: data.style, items };
}

function parseTableBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, ["headers", "rows", "caption"]);
  const headers = requireStringArray(data.headers);
  const rows = requireNonEmptyArray(data.rows).map(requireStringArray);
  if (rows.some((row) => row.length !== headers.length)) {
    throw new Error("Unsupported practice content block");
  }
  const caption = optionalString(data.caption);
  return {
    type: "table",
    headers,
    rows,
    ...(caption ? { caption } : {}),
  };
}

function parseImageBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, ["src", "alt", "caption", "width", "height"]);
  return { type: "image", ...parseImageData(data) };
}

function parseDiagramBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, [
    "src",
    "alt",
    "caption",
    "width",
    "height",
    "purpose",
    "accessible_description",
    "pointers",
  ]);
  const pointers = requireNonEmptyArray(data.pointers).map((value) => {
    if (!isRecord(value)) throw new Error("Unsupported practice content block");
    requireOnlyKeys(value, ["label", "description"]);
    return {
      label: requireSolutionString(value.label),
      description: requireSolutionString(value.description),
    };
  });
  return {
    type: "diagram",
    ...parseImageData(data),
    purpose: requireSolutionString(data.purpose),
    accessibleDescription: requireSolutionString(data.accessible_description),
    pointers,
  };
}

function parseAttachmentBlock(
  data: Record<string, unknown>,
): PracticeTaskTypes.ContentBlock {
  requireOnlyKeys(data, [
    "src",
    "label",
    "description",
    "mime_type",
    "size_bytes",
  ]);
  return {
    type: "attachment",
    src: requireSolutionString(data.src),
    label: requireSolutionString(data.label),
    description: requireSolutionString(data.description),
    mimeType: requireAttachmentMimeType(data.mime_type),
    sizeBytes: requirePositiveInteger(data.size_bytes, ATTACHMENT_MAX_BYTES),
  };
}

function parseImageData(data: Record<string, unknown>) {
  return {
    src: requireSolutionString(data.src),
    alt: requireSolutionString(data.alt),
    caption: requireSolutionString(data.caption),
    width: requirePositiveInteger(data.width),
    height: requirePositiveInteger(data.height),
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

function requireNonEmptyArray(value: unknown): unknown[] {
  const items = requireArray(value);
  if (items.length === 0) throw new Error("Invalid public task projection");
  return items;
}

function requireStringArray(value: unknown): string[] {
  const items = requireNonEmptyArray(value);
  if (!items.every(isString))
    throw new Error("Unsupported practice content block");
  return items;
}

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  return requireSolutionString(value);
}

function requireLanguage(value: unknown): "python" | "text" {
  if (value !== "python" && value !== "text") {
    throw new Error("Unsupported practice content block");
  }
  return value;
}

function requireAttachmentMimeType(
  value: unknown,
): PracticeTaskTypes.AttachmentMimeType {
  if (
    typeof value !== "string" ||
    !attachmentMimeTypes.has(value as PracticeTaskTypes.AttachmentMimeType)
  ) {
    throw new Error("Unsupported practice content block");
  }
  return value as PracticeTaskTypes.AttachmentMimeType;
}

function requirePositiveInteger(value: unknown, maximum = Infinity): number {
  if (
    !Number.isInteger(value) ||
    (value as number) <= 0 ||
    (value as number) > maximum
  ) {
    throw new Error("Unsupported practice content block");
  }
  return value as number;
}

function requireSolutionString(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Unsupported practice content block");
  }
  return value;
}

function requireOnlyKeys(
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
): void {
  if (Object.keys(value).some((key) => !allowedKeys.includes(key))) {
    throw new Error("Unsupported practice content block");
  }
}

function difficultyLabel(difficulty: number): string {
  if (difficulty <= 1) return "Базовая";
  if (difficulty === 2) return "Средняя";
  return "Высокая";
}
