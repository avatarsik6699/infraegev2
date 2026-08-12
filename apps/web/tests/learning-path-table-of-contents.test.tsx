import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LearningPathTableOfContents } from "~/shared/components/learning-path-table-of-contents";
import { render } from "./render";

describe("LearningPathTableOfContents", () => {
  it("renders SSR-safe anchors, one node per item and gapped SVG connections", () => {
    const { container } = render(
      <>
        <LearningPathTableOfContents
          items={[
            {
              id: "section-1",
              label: "Раздел 1",
              description: "Описание раздела",
            },
            {
              id: "section-2",
              label: "Раздел 2",
              description: "Описание раздела",
            },
            {
              id: "section-3",
              label: "Раздел 3",
              description: "Описание раздела",
            },
          ]}
          targetSelector="[data-test-section]"
        />
        <div>
          <h2 id="section-1" data-test-section data-learning-label="Раздел 1">
            Раздел 1
          </h2>
          <h2 id="section-2" data-test-section data-learning-label="Раздел 2">
            Раздел 2
          </h2>
          <h2 id="section-3" data-test-section data-learning-label="Раздел 3">
            Раздел 3
          </h2>
        </div>
      </>,
    );

    expect(
      screen.getByRole("link", { name: "Раздел 1" }).getAttribute("href"),
    ).toBe("#section-1");
    expect(
      container.querySelectorAll("[data-learning-path-node]"),
    ).toHaveLength(3);

    const paths = Array.from(container.querySelectorAll("path"));
    expect(paths).toHaveLength(2);
    expect(paths.map((path) => path.getAttribute("d"))).toEqual([
      "M 18 11 V 22 Q 18 30 26 30 H 44 Q 52 30 52 38 V 49",
      "M 52 11 V 49",
    ]);
  });
});
