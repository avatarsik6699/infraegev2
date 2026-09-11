import { describe, expect, it } from "vitest";
import { CustomIcon } from "~/shared/components/custom-icon";
import { render } from "./render";

describe("CustomIcon", () => {
  it("renders the authored card and stage glyphs with preserved view boxes", () => {
    const result = render(
      <div>
        <CustomIcon.Book />
        <CustomIcon.Checklist />
        <CustomIcon.Braces />
        <CustomIcon.BarChart />
        <CustomIcon.Check />
      </div>,
    );
    const icons = [...result.container.querySelectorAll("[data-icon-name]")];

    expect(icons.map((icon) => icon.getAttribute("data-icon-name"))).toEqual([
      "book",
      "checklist",
      "braces",
      "bar-chart",
      "check",
    ]);
    expect(icons.map((icon) => icon.getAttribute("viewBox"))).toEqual([
      "42 222 160 142",
      "391 197 132 173",
      "706 224 210 143",
      "1088 218 160 145",
      "0 0 32 32",
    ]);
    expect(icons.map((icon) => icon.querySelectorAll("path").length)).toEqual([
      4, 7, 3, 6, 1,
    ]);
    expect(
      result.container
        .querySelector('[data-icon-name="book"] path:last-child')
        ?.getAttribute("fill"),
    ).toBe("var(--custom-icon-accent, var(--color-brand-orange))");
  });

  it("is decorative by default and exposes an explicit labelled mode", () => {
    const result = render(
      <div>
        <CustomIcon.Braces data-testid="decorative" />
        <CustomIcon.Braces data-testid="labelled" label="Фигурные скобки" />
      </div>,
    );

    expect(result.getByTestId("decorative").getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(result.getByTestId("decorative").getAttribute("role")).toBeNull();
    expect(
      result
        .getByRole("img", { name: "Фигурные скобки" })
        .getAttribute("focusable"),
    ).toBe("false");
  });
});
