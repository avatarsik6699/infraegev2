import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DiagramBlock } from "~/components/content-blocks/DiagramBlock";
import { TableDiagramBlock } from "~/components/content-blocks/TableDiagramBlock";
import { WorkedExampleBlock } from "~/components/content-blocks/WorkedExampleBlock";

describe("DiagramBlock", () => {
  it("marks the signalled node with data-highlighted (learning-science-principles.md §2)", () => {
    render(
      <DiagramBlock
        data={{
          kind: "graph",
          ariaLabel: "test graph",
          elements: [
            { kind: "node", id: "A", x: 0, y: 0, text: "A" },
            {
              kind: "node",
              id: "B",
              x: 100,
              y: 0,
              text: "B",
              highlighted: true,
            },
          ],
        }}
      />,
    );
    const svg = screen.getByRole("img", { name: "test graph" });
    const highlighted = svg.querySelectorAll('[data-highlighted="true"]');
    expect(highlighted).toHaveLength(1);
  });
});

describe("TableDiagramBlock", () => {
  it("renders a real semantic table, not SVG (docs/SPEC.md §5.2/§8)", () => {
    render(
      <TableDiagramBlock
        data={{
          kind: "bit-grid",
          ariaLabel: "test table",
          headers: ["", "A"],
          rows: [["A", "1"]],
          highlightedCells: ["0,1"],
        }}
      />,
    );
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByText("1").getAttribute("data-highlighted")).toBe("true");
  });
});

describe("WorkedExampleBlock", () => {
  it("shows worked_example steps immediately", () => {
    render(
      <WorkedExampleBlock
        type="worked_example"
        data={{ prompt: "Prompt", steps: ["Step one", "Step two"] }}
      />,
    );
    expect(screen.getByText("Step one")).toBeTruthy();
  });

  it("hides completion_exercise steps behind a disclosure (productive-failure framing)", () => {
    render(
      <WorkedExampleBlock
        type="completion_exercise"
        data={{ prompt: "Prompt", steps: ["Hidden step"] }}
      />,
    );
    expect(screen.getByText("Показать разбор")).toBeTruthy();
  });
});
