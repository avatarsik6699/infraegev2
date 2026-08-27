import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadPracticeTasks } from "~/entities/practice-task";
import { contentFiles } from "~/shared/lib/content-files";

vi.mock("~/shared/lib/content-files", () => ({
  contentFiles: { readTask: vi.fn() },
}));

const taskSource = (explanation: unknown[]) =>
  JSON.stringify({
    id: "task-1",
    title: "Задача",
    statement: "Условие",
    hint: "Подсказка",
    theory_links: [{ hash: "idea", label: "Идея" }],
    difficulty: 2,
    explanation,
  });

describe("practice task parser", () => {
  beforeEach(() => {
    vi.mocked(contentFiles.readTask).mockReset();
  });

  it("maps every supported solution block into the public projection", async () => {
    vi.mocked(contentFiles.readTask).mockResolvedValue(
      taskSource([
        { type: "text", data: { markdown: "Текст" } },
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
          data: { language: "plaintext", code: "result", caption: null },
        },
      ]),
    );

    await expect(loadPracticeTasks(["task-1"])).resolves.toEqual([
      expect.objectContaining({
        id: "task-1",
        difficultyLabel: "Средняя",
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
        statement: "Условие",
        hint: "Подсказка",
        theory_links: [{ hash: "idea" }],
        difficulty: 1,
        explanation: [],
      }),
      "Invalid public task projection",
    ],
    [
      "invalid solution shape",
      taskSource([null]),
      "Invalid practice solution block",
    ],
    [
      "unsupported solution type",
      taskSource([{ type: "diagram", data: {} }]),
      "Unsupported practice solution block",
    ],
    [
      "invalid supported solution data",
      taskSource([{ type: "text", data: { markdown: 42 } }]),
      "Unsupported practice solution block",
    ],
  ])("rejects %s", async (_label: string, source: string, message: string) => {
    vi.mocked(contentFiles.readTask).mockResolvedValue(source);

    await expect(loadPracticeTasks(["task-1"])).rejects.toThrow(message);
  });

  it("rejects a source whose id does not match the requested task", async () => {
    vi.mocked(contentFiles.readTask).mockResolvedValue(
      taskSource([]).replace('"task-1"', '"other-task"'),
    );

    await expect(loadPracticeTasks(["task-1"])).rejects.toThrow(
      "Task id mismatch for task-1",
    );
  });
});
