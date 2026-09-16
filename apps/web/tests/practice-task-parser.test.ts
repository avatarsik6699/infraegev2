import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseContentBlock,
  loadLessonPractice,
} from "~/entities/practice-task/api/load-practice-tasks.server";

const text = { type: "text", data: { markdown: "Условие" } };

describe("public practice projection", () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    [text, { type: "text", text: "Условие" }],
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

  it("loads server relations with their solution revision and no browser checker", async () => {
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
                difficulty: 1,
                statement: [text],
                hint: [],
                explanation: [text],
                theory_links: [
                  { material_id: "lesson", section: "idea", label: "Идея" },
                  { material_id: "lesson", section: null, label: "Весь урок" },
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
    expect(result.tasks[0]?.theoryLinks).toEqual([
      { hash: "idea", label: "Идея" },
    ]);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect((fetchMock.mock.calls[0]?.[0] as Request).cache).toBe("no-store");
  });

  it("returns dependency failure without reading legacy JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    expect(await loadLessonPractice("topic", "rekursiya")).toEqual({
      tasks: [],
      practiceUnavailable: true,
    });
  });
});
