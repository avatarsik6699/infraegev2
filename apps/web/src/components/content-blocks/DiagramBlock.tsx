import type { DiagramBlockData, DiagramElement } from "~/content/types";

const NODE_RADIUS = 20;

/**
 * Graph/automaton diagrams — pure SVG rendered from declarative data (docs/SPEC.md §5.2).
 * Coordinates come from the content file, not a runtime layout algorithm. Labels sit on the
 * element they describe (split-attention effect, learning-science-principles.md §1.2), and the
 * element the surrounding text is discussing gets `data-highlighted` (signalling, §2).
 */
export function DiagramBlock({ data }: { data: DiagramBlockData }) {
  const nodes = data.elements.filter((el) => el.kind === "node");
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      role="img"
      aria-label={data.ariaLabel}
      viewBox={viewBoxFor(nodes)}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <title>{data.ariaLabel}</title>
      {data.elements.map((el) => renderElement(el, byId))}
    </svg>
  );
}

function viewBoxFor(nodes: DiagramElement[]): string {
  const xs = nodes.map((n) => n.x ?? 0);
  const ys = nodes.map((n) => n.y ?? 0);
  const maxX = Math.max(0, ...xs) + NODE_RADIUS * 2;
  const maxY = Math.max(0, ...ys) + NODE_RADIUS * 2;
  return `0 0 ${maxX} ${maxY}`;
}

function renderElement(el: DiagramElement, byId: Map<string, DiagramElement>) {
  const highlighted = el.highlighted ? "true" : "false";

  switch (el.kind) {
    case "node":
      return (
        <g key={el.id} data-highlighted={highlighted}>
          <circle
            cx={el.x}
            cy={el.y}
            r={NODE_RADIUS}
            fill="none"
            stroke="currentColor"
          />
          <text
            x={el.x}
            y={el.y}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {el.text ?? el.id}
          </text>
        </g>
      );
    case "edge":
    case "arrow": {
      const from = el.from ? byId.get(el.from) : undefined;
      const to = el.to ? byId.get(el.to) : undefined;
      if (!from || !to) return null;
      return (
        <line
          key={el.id}
          data-highlighted={highlighted}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="currentColor"
          markerEnd={el.kind === "arrow" ? "url(#arrowhead)" : undefined}
        />
      );
    }
    case "label":
      return (
        <text key={el.id} data-highlighted={highlighted} x={el.x} y={el.y}>
          {el.text}
        </text>
      );
    case "highlight": {
      // Standalone ring drawn over an existing node/edge, for signalling a specific element
      // without changing that element's own markup (learning-science-principles.md §2).
      const target = el.from ? byId.get(el.from) : undefined;
      if (!target) return null;
      return (
        <circle
          key={el.id}
          data-highlighted="true"
          cx={target.x}
          cy={target.y}
          r={NODE_RADIUS + 4}
          fill="none"
          strokeWidth={2}
        />
      );
    }
    default:
      return null;
  }
}
