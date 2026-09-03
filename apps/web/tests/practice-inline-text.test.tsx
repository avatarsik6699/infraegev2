import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PracticeInlineText } from "~/features/lesson-practice/components/practice-inline-text";
import { render } from "./render";

describe("PracticeInlineText", () => {
  it("renders backtick-delimited fragments as inline code", () => {
    const result = render(
      <PracticeInlineText text="Добавьте `:` после `if score >= 10`." />,
    );

    expect(screen.getByText(":").tagName).toBe("CODE");
    expect(screen.getByText("if score >= 10").tagName).toBe("CODE");
    expect(result.container.textContent).toBe(
      "Добавьте : после if score >= 10.",
    );
  });

  it("keeps an unmatched backtick visible as ordinary text", () => {
    const result = render(
      <PracticeInlineText text="Проверьте `SyntaxError без пары." />,
    );

    expect(result.container.querySelector("code")).toBeNull();
    expect(result.container.textContent).toBe(
      "Проверьте `SyntaxError без пары.",
    );
  });
});
