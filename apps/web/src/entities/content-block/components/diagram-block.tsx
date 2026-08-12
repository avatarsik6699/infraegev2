import type { DiagramBlockData, DiagramElement } from "~/entities/content";

const NODE_RADIUS = 20;

type Props = { data: DiagramBlockData };

/**
 * Graph/automaton diagrams — pure SVG rendered from declarative data (docs/SPEC.md §5.2).
 * Coordinates come from the content file, not a runtime layout algorithm. Labels sit on the
 * element they describe (split-attention effect, learning-science-principles.md §1.2), and the
 * element the surrounding text is discussing gets `data-highlighted` (signalling, §2).
 */
export const DiagramBlock: React.FC<Props> = (props) => {
  const nodes = props.data.elements.filter((el) => el.kind === "node");
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      role="img"
      aria-label={props.data.ariaLabel}
      viewBox={viewBoxFor(nodes)}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <title>{props.data.ariaLabel}</title>
      {props.data.elements.map((el) => renderElement(el, byId))}
    </svg>
  );
};

function viewBoxFor(nodes: DiagramElement[]): string {
  const xs = nodes.map((n) => n.x ?? 0);
  const ys = nodes.map((n) => n.y ?? 0);
  const maxX = Math.max(0, ...xs) + NODE_RADIUS * 2;
  const maxY = Math.max(0, ...ys) + NODE_RADIUS * 2;
  return `0 0 ${maxX} ${maxY}`;
}

function renderElement(el: DiagramElement, byId: Map<string, DiagramElement>) {
  switch (el.kind) {
    case "node":
      return renderNode(el);
    case "edge":
    case "arrow":
      return renderConnection(el, byId);
    case "label":
      return renderLabel(el);
    case "highlight":
      return renderHighlight(el, byId);
  }
}

function renderNode(el: DiagramElement) {
  return (
    <g key={el.id} data-highlighted={highlightedValue(el)}>
      <circle
        cx={el.x ?? undefined}
        cy={el.y ?? undefined}
        r={NODE_RADIUS}
        fill="none"
        stroke="currentColor"
      />
      <text
        x={el.x ?? undefined}
        y={el.y ?? undefined}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {el.text ?? el.id}
      </text>
    </g>
  );
}

function renderConnection(
  el: DiagramElement,
  byId: Map<string, DiagramElement>,
) {
  const from = el.from ? byId.get(el.from) : undefined;
  const to = el.to ? byId.get(el.to) : undefined;
  if (!from || !to) return null;
  return (
    <line
      key={el.id}
      data-highlighted={highlightedValue(el)}
      x1={from.x ?? undefined}
      y1={from.y ?? undefined}
      x2={to.x ?? undefined}
      y2={to.y ?? undefined}
      stroke="currentColor"
      markerEnd={el.kind === "arrow" ? "url(#arrowhead)" : undefined}
    />
  );
}

function renderLabel(el: DiagramElement) {
  return (
    <text
      key={el.id}
      data-highlighted={highlightedValue(el)}
      x={el.x ?? undefined}
      y={el.y ?? undefined}
    >
      {el.text}
    </text>
  );
}

function renderHighlight(
  el: DiagramElement,
  byId: Map<string, DiagramElement>,
) {
  // Standalone ring drawn over an existing node/edge, for signalling a specific element.
  const target = el.from ? byId.get(el.from) : undefined;
  if (!target) return null;
  return (
    <circle
      key={el.id}
      data-highlighted="true"
      cx={target.x ?? undefined}
      cy={target.y ?? undefined}
      r={NODE_RADIUS + 4}
      fill="none"
      strokeWidth={2}
    />
  );
}

function highlightedValue(el: DiagramElement): "true" | "false" {
  return el.highlighted ? "true" : "false";
}
