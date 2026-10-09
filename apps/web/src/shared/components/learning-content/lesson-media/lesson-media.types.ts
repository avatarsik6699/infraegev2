/** Media written by `scripts/lesson_design/export_media.py` (Change 171). */
export namespace LessonMediaTypes {
  export type Diagram = {
    kind: "diagram";
    /** Repository-generated SVG markup, rendered inline in the page font. */
    svg: string;
    width: number;
    height: number;
    /** Short name of the picture for screen readers; the idea is the caption. */
    alt: string;
  };

  export type StepperFrame = { svg: string; caption: string };

  export type Stepper = {
    kind: "stepper";
    width: number;
    height: number;
    frames: readonly [StepperFrame, ...StepperFrame[]];
  };

  export type GraphNode = { id: number | string; x: number; y: number };

  export type GraphEdge = {
    from: number | string;
    to: number | string;
    /** The weight exactly as written in the lesson («2.4»). */
    weight: string;
    /** Curve and arrowhead in the graph's own coordinates. */
    path: string;
    arrow: string;
    label: { x: number; y: number; width: number } | null;
  };

  /**
   * Data of a graph sandbox (Change 172): geometry from `figures.graph_layout`,
   * the single layout shared with the stand, drawn by the site component.
   */
  export type Graph = {
    kind: "graph";
    width: number;
    height: number;
    nodes: readonly GraphNode[];
    edges: readonly GraphEdge[];
    source: number | string;
    target: number | string;
    /** Shortest path length with the weights' decimals («6.9»). */
    shortest: string;
  };

  export type Generated = Diagram | Stepper | Graph;
}
