import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonFigure } from "~/shared/components/learning-content";

const props = {
  src: "/lesson-media/demo/figure.webp",
  width: 1600,
  height: 800,
  alt: "дерево вызовов",
  caption: "Без кеша девять вызовов, с кешем пять.",
};

describe("LessonFigure", () => {
  it("renders the picture with a description, reserved size and lazy loading", () => {
    const { container } = render(<LessonFigure {...props} />);
    const image = container.querySelector("img")!;
    expect(image.getAttribute("src")).toBe(props.src);
    expect(image.getAttribute("alt")).toBe(props.alt);
    expect(image.getAttribute("width")).toBe("1600");
    expect(image.getAttribute("height")).toBe("800");
    expect(image.getAttribute("loading")).toBe("lazy");
  });

  it("has exactly one caption and no service label", () => {
    const { container } = render(<LessonFigure {...props} />);
    expect(container.querySelectorAll("figcaption")).toHaveLength(1);
    expect(container.querySelector("figcaption")?.textContent).toBe(
      props.caption,
    );
    expect(container.textContent).not.toContain("Текстовое описание");
  });

  it("marks the figure so tests and styles can find it", () => {
    const { container } = render(<LessonFigure {...props} />);
    expect(container.querySelector("figure[data-lesson-figure]")).toBeTruthy();
  });
});
