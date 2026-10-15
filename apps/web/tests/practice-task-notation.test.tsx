import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { practiceTaskNotation } from "~/entities/practice-task";
import { PracticeInlineText } from "~/features/lesson-practice/components/practice-inline-text";
import { PracticeTaskContent } from "~/features/lesson-practice/components/practice-task-content";
import { render } from "./render";

describe("practice task notation (Change 185, F7)", () => {
  it("reads TeX scripts and an escaped percent in plain text", () => {
    expect(
      practiceTaskNotation.plain("Чему равно значение выражения F(10^{30})?"),
    ).toBe("Чему равно значение выражения F(10³⁰)?");
    expect(practiceTaskNotation.plain("Посчитайте C_{12}")).toBe(
      "Посчитайте C₁₂",
    );
    expect(practiceTaskNotation.plain("F(y, x\\%y) и 2^{k+1}")).toBe(
      "F(y, x%y) и 2^(k+1)",
    );
    expect(practiceTaskNotation.plain("a ^ b")).toBe("a ^ b");
  });

  it("splits a formula into text and script segments", () => {
    expect(practiceTaskNotation.segments("n\\%10 + F(2^{n})")).toEqual([
      { kind: "text", text: "n%10 + F(2" },
      { kind: "sup", text: "n" },
      { kind: "text", text: ")" },
    ]);
    expect(practiceTaskNotation.has("F(n // 10)")).toBe(false);
  });

  it("renders scripts in formula spans and text but not in code", () => {
    const result = render(
      <PracticeTaskContent
        context="statement"
        blocks={[
          {
            type: "rich-text",
            spans: [
              { kind: "text", text: "Найдите " },
              { kind: "formula", text: "F(10^{30})" },
              { kind: "text", text: " и " },
              { kind: "formula", text: "n\\%10" },
              { kind: "text", text: ", код " },
              { kind: "code", text: "x^{2}" },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByText("30").tagName).toBe("SUP");
    expect(result.container.textContent).toBe(
      "Найдите F(1030) и n%10, код x^{2}",
    );
  });

  it("keeps backtick code literal in inline text", () => {
    const result = render(
      <PracticeInlineText text="Значение C_{12} и `2^{1890}`" />,
    );

    expect(screen.getByText("12").tagName).toBe("SUB");
    expect(screen.getByText("2^{1890}").tagName).toBe("CODE");
    expect(result.container.textContent).toBe("Значение C12 и 2^{1890}");
  });
});
