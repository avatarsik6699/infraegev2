import type { components } from "~/shared/api/schema";
import { practiceServerClient } from "./practice-server-client.server";
import type { PracticeTaskTypes } from "../practice-task.types";

export function parseContentBlock(
  value: unknown,
): PracticeTaskTypes.ContentBlock {
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

const ATTACHMENT_MAX_BYTES = 20 * 1024 * 1024;

const attachmentMimeTypes = new Set<PracticeTaskTypes.AttachmentMimeType>([
  "text/plain",
  "text/csv",
  "application/json",
  "text/x-python",
  "application/zip",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.text",
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
    caption: optionalString(data.caption) ?? "",
    width: requirePositiveInteger(data.width),
    height: requirePositiveInteger(data.height),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
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

type PublicTask = components["schemas"]["PublicTask"];

export function projectPracticeTask(
  source: PublicTask,
  materialId: string,
): PracticeTaskTypes.Task {
  const blocks = (values: PublicTask["content"]["statement"]) =>
    values.map((block) => {
      if (
        block.type !== "attachment" &&
        block.type !== "image" &&
        block.type !== "diagram"
      )
        return parseContentBlock(block);
      const usage = source.content.files?.find(
        (file) => file.id === block.data.usage_id,
      );
      const delivery = source.deliveries?.find(
        (file) => file.usage_id === block.data.usage_id,
      );
      if (!usage || !delivery) throw new Error("Missing public file delivery");
      if (block.type === "attachment")
        return parseContentBlock({
          type: "attachment",
          data: {
            src: delivery.url,
            label: usage.filename,
            description: usage.description,
            mime_type: delivery.mime_type,
            size_bytes: delivery.size_bytes,
          },
        });
      const data = Object.fromEntries(
        Object.entries(block.data).filter(([key]) => key !== "usage_id"),
      );
      return parseContentBlock({
        type: block.type,
        data: {
          ...data,
          caption: data.caption ?? undefined,
          src: delivery.url,
        },
      });
    });
  return {
    id: source.id,
    solutionRevision: source.solution_revision,
    title: source.content.title,
    difficultyLabel: difficultyLabel(source.content.difficulty),
    statement: blocks(source.content.statement),
    hint: blocks(source.content.hint),
    solution: blocks(source.content.explanation),
    theoryLinks: (source.content.theory_links ?? []).flatMap((link) =>
      link.material_id === materialId && link.section
        ? [{ hash: link.section, label: link.label }]
        : [],
    ),
  };
}

export async function loadLessonPractice(
  kind: "topic" | "course",
  materialId: string,
) {
  try {
    const result = await practiceServerClient.GET(
      "/api/learning-materials/{kind}/{material_id}/practice",
      {
        params: { path: { kind, material_id: materialId } },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!result.data || !result.response.ok)
      throw new Error("Practice unavailable");
    return {
      tasks: result.data.tasks.map(
        (task: components["schemas"]["PublicTask"]) =>
          projectPracticeTask(task, materialId),
      ),
      practiceUnavailable: false,
    };
  } catch {
    return { tasks: [], practiceUnavailable: true };
  }
}

export async function loadCoursePracticeSummary(courseId: string) {
  try {
    const result = await practiceServerClient.GET(
      "/api/courses/{course_id}/practice-summary",
      {
        params: { path: { course_id: courseId } },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      },
    );
    return result.response.ok && result.data
      ? result.data.lessons.map(
          (lesson: components["schemas"]["LessonSummary"]) => ({
            id: lesson.id,
            tasks: lesson.tasks.map(
              (task: components["schemas"]["TaskVersion"]) => ({
                id: task.id,
                solutionRevision: task.solution_revision,
              }),
            ),
          }),
        )
      : null;
  } catch {
    return null;
  }
}
