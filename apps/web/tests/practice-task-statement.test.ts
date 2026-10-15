import { describe, expect, it } from "vitest";
import { practiceTaskStatement } from "~/entities/practice-task";

const code = { type: "code", code: "7 * 6", language: "python" } as const;

describe("statement without the repeated title (Change 186 F12)", () => {
  it("drops a lead block that only repeats the title", () => {
    const title = "Сколько строк напечатает программа и какие?";
    expect(
      practiceTaskStatement.withoutTitle(
        [{ type: "text", text: title }, code],
        title,
      ),
    ).toEqual([code]);
  });

  it("keeps the rest of a lead that opens with the title sentence", () => {
    expect(
      practiceTaskStatement.withoutTitle(
        [
          {
            type: "rich-text",
            spans: [
              { kind: "text", text: "Найдите сумму. Затем выведите " },
              { kind: "code", text: "s" },
            ],
          },
        ],
        "Найдите сумму.",
      ),
    ).toEqual([
      {
        type: "rich-text",
        spans: [
          { kind: "text", text: "Затем выведите " },
          { kind: "code", text: "s" },
        ],
      },
    ]);
  });

  it("leaves a statement whose lead only shares the opening words", () => {
    const statement = [
      { type: "text", text: "Найдите сумму чисел файла." },
    ] as const;
    expect(practiceTaskStatement.withoutTitle(statement, "Найдите сумму")).toBe(
      statement,
    );
  });
});
