import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadPracticeTasks } from "~/entities/practice-task";
import { contentFiles } from "~/shared/lib/content-files";

vi.mock("~/shared/lib/content-files", () => ({
  contentFiles: { readTask: vi.fn() },
}));

const textSource = (text: string) => ({
  type: "text",
  data: { markdown: text },
});

const taskSource = (explanation: unknown[]) =>
  JSON.stringify({
    id: "task-1",
    title: "Задача",
    statement: [textSource("Условие")],
    hint: [textSource("Подсказка")],
    theory_links: [{ hash: "idea", label: "Идея" }],
    difficulty: 2,
    explanation,
  });

describe("practice task parser", () => {
  beforeEach(() => {
    vi.mocked(contentFiles.readTask).mockReset();
  });

  it("maps every supported content block into the public projection", async () => {
    vi.mocked(contentFiles.readTask).mockResolvedValue(
      taskSource([
        textSource("Текст"),
        { type: "callout", data: { tone: "info", markdown: "Идея" } },
        {
          type: "callout",
          data: { tone: "warning", markdown: "Осторожно" },
        },
        {
          type: "worked_example",
          data: { prompt: "Пример", steps: ["Шаг 1"] },
        },
        {
          type: "completion_exercise",
          data: { prompt: "Дополните", steps: ["Шаг 2"] },
        },
        {
          type: "productive_failure_prompt",
          data: { prompt: "Попробуйте", steps: ["Шаг 3"] },
        },
        {
          type: "code_example",
          data: { language: "python", code: "print(1)", caption: "Код" },
        },
        {
          type: "code_example",
          data: { language: "text", code: "result", caption: null },
        },
        {
          type: "list",
          data: { style: "unordered", items: ["Первый", "Второй"] },
        },
        {
          type: "table",
          data: { headers: ["n", "F(n)"], rows: [["1", "1"]] },
        },
        {
          type: "image",
          data: {
            src: "/content/tasks/task-1/image.png",
            alt: "Изображение",
            caption: "Подпись",
            width: 640,
            height: 360,
          },
        },
        {
          type: "diagram",
          data: {
            src: "/content/tasks/task-1/diagram.webp",
            alt: "Схема",
            caption: "Подпись схемы",
            width: 640,
            height: 360,
            purpose: "Показать связь",
            accessible_description: "Первый элемент ведёт ко второму",
            pointers: [{ label: "Первый", description: "Начало" }],
          },
        },
        {
          type: "attachment",
          data: {
            src: "/content/tasks/task-1/data.txt",
            label: "data.txt",
            description: "Данные",
            mime_type: "text/plain",
            size_bytes: 12,
          },
        },
      ]),
    );

    await expect(loadPracticeTasks(["task-1"])).resolves.toEqual([
      expect.objectContaining({
        id: "task-1",
        difficultyLabel: "Средняя",
        statement: [{ type: "text", text: "Условие" }],
        hint: [{ type: "text", text: "Подсказка" }],
        solution: [
          { type: "text", text: "Текст" },
          { type: "callout", tone: "idea", text: "Идея" },
          { type: "callout", tone: "warning", text: "Осторожно" },
          { type: "steps", prompt: "Пример", steps: ["Шаг 1"] },
          { type: "steps", prompt: "Дополните", steps: ["Шаг 2"] },
          { type: "steps", prompt: "Попробуйте", steps: ["Шаг 3"] },
          {
            type: "code",
            language: "python",
            code: "print(1)",
            caption: "Код",
          },
          { type: "code", language: "text", code: "result" },
          {
            type: "list",
            style: "unordered",
            items: ["Первый", "Второй"],
          },
          {
            type: "table",
            headers: ["n", "F(n)"],
            rows: [["1", "1"]],
          },
          {
            type: "image",
            src: "/content/tasks/task-1/image.png",
            alt: "Изображение",
            caption: "Подпись",
            width: 640,
            height: 360,
          },
          {
            type: "diagram",
            src: "/content/tasks/task-1/diagram.webp",
            alt: "Схема",
            caption: "Подпись схемы",
            width: 640,
            height: 360,
            purpose: "Показать связь",
            accessibleDescription: "Первый элемент ведёт ко второму",
            pointers: [{ label: "Первый", description: "Начало" }],
          },
          {
            type: "attachment",
            src: "/content/tasks/task-1/data.txt",
            label: "data.txt",
            description: "Данные",
            mimeType: "text/plain",
            sizeBytes: 12,
          },
        ],
      }),
    ]);
  });

  it.each<[string, string, string]>([
    [
      "non-object source",
      JSON.stringify(null),
      "Invalid public task projection",
    ],
    [
      "malformed theory link",
      JSON.stringify({
        id: "task-1",
        title: "Задача",
        statement: [textSource("Условие")],
        hint: [textSource("Подсказка")],
        theory_links: [{ hash: "idea" }],
        difficulty: 1,
        explanation: [textSource("Решение")],
      }),
      "Invalid public task projection",
    ],
    [
      "invalid content shape",
      taskSource([null]),
      "Invalid practice content block",
    ],
    [
      "unsupported content type",
      taskSource([{ type: "video_embed", data: {} }]),
      "Unsupported practice content block",
    ],
    [
      "invalid supported content data",
      taskSource([{ type: "text", data: { markdown: 42 } }]),
      "Unsupported practice content block",
    ],
    ["empty explanation", taskSource([]), "Invalid public task projection"],
    [
      "empty steps",
      taskSource([
        { type: "worked_example", data: { prompt: "Пример", steps: [] } },
      ]),
      "Invalid public task projection",
    ],
    [
      "empty table rows",
      taskSource([{ type: "table", data: { headers: ["n"], rows: [] } }]),
      "Invalid public task projection",
    ],
    [
      "empty diagram pointers",
      taskSource([
        {
          type: "diagram",
          data: {
            src: "/content/tasks/task-1/diagram.webp",
            alt: "Схема",
            caption: "Подпись",
            width: 640,
            height: 360,
            purpose: "Показать связь",
            accessible_description: "Описание",
            pointers: [],
          },
        },
      ]),
      "Invalid public task projection",
    ],
    [
      "unsupported attachment MIME type",
      taskSource([
        {
          type: "attachment",
          data: {
            src: "/content/tasks/task-1/data.txt",
            label: "data.txt",
            description: "Данные",
            mime_type: "text/html",
            size_bytes: 12,
          },
        },
      ]),
      "Unsupported practice content block",
    ],
    [
      "oversized attachment metadata",
      taskSource([
        {
          type: "attachment",
          data: {
            src: "/content/tasks/task-1/data.txt",
            label: "data.txt",
            description: "Данные",
            mime_type: "text/plain",
            size_bytes: 5 * 1024 * 1024 + 1,
          },
        },
      ]),
      "Unsupported practice content block",
    ],
    [
      "unknown content field",
      taskSource([
        { type: "text", data: { markdown: "Текст", unsafe_html: "<b>x</b>" } },
      ]),
      "Unsupported practice content block",
    ],
  ])("rejects %s", async (_label: string, source: string, message: string) => {
    vi.mocked(contentFiles.readTask).mockResolvedValue(source);

    await expect(loadPracticeTasks(["task-1"])).rejects.toThrow(message);
  });

  it("rejects a source whose id does not match the requested task", async () => {
    vi.mocked(contentFiles.readTask).mockResolvedValue(
      taskSource([textSource("Решение")]).replace('"task-1"', '"other-task"'),
    );

    await expect(loadPracticeTasks(["task-1"])).rejects.toThrow(
      "Task id mismatch for task-1",
    );
  });
});
