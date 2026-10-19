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

describe("statement excerpt for search snippets (Change 194)", () => {
  const statement = [
    {
      type: "rich-text",
      spans: [
        {
          kind: "text",
          text: "(PRO100 ЕГЭ) Алгоритм вычисления значения функции ",
        },
        { kind: "formula", text: "F(n)" },
        { kind: "text", text: " задан соотношениями:" },
      ],
    },
    code,
    {
      type: "list",
      style: "unordered",
      items: ["F(n) = n при n < 10", "иначе F(n // 10)"],
    },
  ] as const;

  it("joins words, skips code and drops a leading source credit", () => {
    expect(practiceTaskStatement.excerpt(statement, 500)).toBe(
      "Алгоритм вычисления значения функции F(n) задан соотношениями: F(n) = n при n < 10; иначе F(n // 10)",
    );
  });

  it("cuts long text at a word boundary with an ellipsis", () => {
    const short = practiceTaskStatement.excerpt(statement, 30);
    expect(short).toBe("Алгоритм вычисления значения…");
    expect(short.length).toBeLessThanOrEqual(30);
  });

  it("undoes formula escapes", () => {
    expect(
      practiceTaskStatement.excerpt(
        [
          {
            type: "rich-text",
            spans: [{ kind: "formula", text: "F(n) = n\\%10" }],
          },
        ],
        60,
      ),
    ).toBe("F(n) = n%10");
  });

  it("gives an empty excerpt for a code-only statement", () => {
    expect(practiceTaskStatement.excerpt([code], 60)).toBe("");
  });
});
