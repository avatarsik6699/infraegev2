import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseContentBlock,
  loadLessonPractice,
  projectPracticeTask,
} from "~/entities/practice-task/api/load-practice-tasks.server";

vi.mock("~/shared/api/session-cookie.server", () => ({
  sessionCookie: { header: () => undefined },
}));

const text = { type: "text", data: { markdown: "Условие" } };

describe("public practice projection", () => {
  it("projects tasks without help and keeps original XLS deliveries", () => {
    const result = projectPracticeTask(
      {
        id: "imported-task",
        revision: 1,
        solution_revision: 1,
        content: {
          id: "imported-task",
          title: "Таблица",
          answer_instruction: "Запишите целое число.",
          archived: false,
          catalog_visible: true,
          content_schema_version: 2,
          explanation_kind: "unclassified",
          interaction_type: "production",
          sources: [],
          difficulty: 1,
          statement: [{ type: "attachment", data: { usage_id: "data" } }],
          hint: [],
          explanation: [],
          files: [
            {
              id: "data",
              filename: "source.xls",
              description: "Исходная таблица",
              purpose: "attachment",
              checksum: "a".repeat(64),
            },
          ],
        },
        deliveries: [
          {
            usage_id: "data",
            url: "/api/tasks/imported-task/files/data",
            mime_type: "application/vnd.ms-excel",
            size_bytes: 4096,
          },
        ],
      },
      "",
    );
    expect(result.hint).toEqual([]);
    expect(result.solution).toEqual([]);
    expect(result.statement).toEqual([
      {
        type: "attachment",
        src: "/api/tasks/imported-task/files/data",
        label: "source.xls",
        description: "Исходная таблица",
        mimeType: "application/vnd.ms-excel",
        sizeBytes: 4096,
      },
    ]);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("accepts the large source datasets within the 64 MiB attachment limit", () => {
    const block = (size: number) => ({
      type: "attachment",
      data: {
        src: "/api/tasks/task/files/data",
        label: "data.txt",
        description: "Исходные данные",
        mime_type: "text/plain",
        size_bytes: size,
      },
    });
    expect(parseContentBlock(block(31_944_094))).toMatchObject({
      sizeBytes: 31_944_094,
    });
    expect(parseContentBlock(block(50_084_031))).toMatchObject({
      sizeBytes: 50_084_031,
    });
    expect(parseContentBlock(block(64 * 1024 * 1024))).toBeTruthy();
    expect(() => parseContentBlock(block(64 * 1024 * 1024 + 1))).toThrow();
  });

  it.each([
    [text, { type: "text", text: "Условие" }],
    [
      {
        type: "attachment",
        data: {
          src: "/api/tasks/task/files/data",
          label: "data.xls",
          description: "Исходная таблица",
          mime_type: "application/vnd.ms-excel",
          size_bytes: 4096,
        },
      },
      {
        type: "attachment",
        src: "/api/tasks/task/files/data",
        label: "data.xls",
        description: "Исходная таблица",
        mimeType: "application/vnd.ms-excel",
        sizeBytes: 4096,
      },
    ],
    [
      { type: "callout", data: { tone: "info", markdown: "Идея" } },
      { type: "callout", tone: "idea", text: "Идея" },
    ],
    [
      { type: "worked_example", data: { prompt: "Пример", steps: ["Шаг"] } },
      { type: "steps", prompt: "Пример", steps: ["Шаг"] },
    ],
    [
      { type: "list", data: { style: "ordered", items: ["Шаг"] } },
      { type: "list", style: "ordered", items: ["Шаг"] },
    ],
    [
      { type: "table", data: { headers: ["n"], rows: [["1"]] } },
      { type: "table", headers: ["n"], rows: [["1"]] },
    ],
    [
      { type: "code_example", data: { language: "python", code: "print(1)" } },
      { type: "code", language: "python", code: "print(1)" },
    ],
  ])("maps supported block %#", (source, expected) =>
    expect(parseContentBlock(source)).toEqual(expected),
  );

  it.each([
    null,
    { type: "video_embed", data: {} },
    { type: "text", data: { markdown: 42 } },
    { type: "text", data: { markdown: "text", unsafe_html: "<b>x</b>" } },
    { type: "worked_example", data: { prompt: "Пример", steps: [] } },
    { type: "table", data: { headers: ["n"], rows: [] } },
    { type: "table", data: { headers: ["n"], rows: [["1", "2"]] } },
    {
      type: "image",
      data: {
        src: "/api/files/image",
        alt: "image",
        caption: "caption",
        width: 0,
        height: 10,
      },
    },
    {
      type: "attachment",
      data: {
        src: "/api/files/data",
        label: "data",
        description: "data",
        mime_type: "text/html",
        size_bytes: 10,
      },
    },
  ])("rejects malformed public blocks %#", (source) =>
    expect(() => parseContentBlock(source)).toThrow(),
  );

  it.each([3, 1, 2])(
    "loads server relations with actual difficulty %s, revision and no browser checker",
    async (difficulty) => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: "lesson",
            kind: "topic",
            tasks: [
              {
                id: "task",
                revision: 3,
                solution_revision: 2,
                content: {
                  id: "task",
                  title: "Задача",
                  difficulty,
                  statement: [text],
                  hint: [],
                  explanation: [text],
                  theory_links: [
                    { material_id: "lesson", section: "idea", label: "Идея" },
                    {
                      material_id: "lesson",
                      section: null,
                      label: "Весь урок",
                    },
                    {
                      material_id: "other",
                      section: "idea",
                      label: "Другой урок",
                    },
                  ],
                },
                deliveries: [],
              },
            ],
          }),
          { headers: { "Content-Type": "application/json" } },
        ),
      );
      vi.stubGlobal("fetch", fetchMock);
      const result = await loadLessonPractice("topic", "lesson");
      expect(result.practiceUnavailable).toBe(false);
      expect(result.tasks[0]?.solutionRevision).toBe(2);
      expect(result.tasks[0]?.difficulty).toBe(difficulty);
      expect(result.tasks[0]?.theoryLinks).toEqual([
        { hash: "idea", label: "Идея" },
      ]);
      expect(fetchMock).toHaveBeenCalledOnce();
      expect((fetchMock.mock.calls[0]?.[0] as Request).cache).toBe("no-store");
    },
  );

  it("returns dependency failure without reading legacy JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    expect(await loadLessonPractice("topic", "rekursiya")).toEqual({
      tasks: [],
      lockedTasks: [],
      practiceUnavailable: true,
    });
  });
});
