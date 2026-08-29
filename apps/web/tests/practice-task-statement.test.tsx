import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PracticeTaskStatement } from "~/features/lesson-practice/components/practice-task-statement";
import { render } from "./render";

describe("PracticeTaskStatement", () => {
  it("renders backtick-delimited fragments as inline code", () => {
    const result = render(
      <PracticeTaskStatement statement="Добавьте `:` после `if score >= 10`." />,
    );

    expect(screen.getByText(":").tagName).toBe("CODE");
    expect(screen.getByText("if score >= 10").tagName).toBe("CODE");
    expect(result.container.textContent).toBe(
      "Добавьте : после if score >= 10.",
    );
  });

  it("keeps an unmatched backtick visible as ordinary text", () => {
    const result = render(
      <PracticeTaskStatement statement="Проверьте `SyntaxError без пары." />,
    );

    expect(result.container.querySelector("code")).toBeNull();
    expect(result.container.textContent).toBe(
      "Проверьте `SyntaxError без пары.",
    );
  });
});
