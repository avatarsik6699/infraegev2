import type { DiagramGeometry, DiagramGeometryPoint } from "./diagram-geometry";

type GeometryListener = (geometry: DiagramGeometry) => void;

export function observeDiagramGeometry(
  root: HTMLElement,
  listener: GeometryListener,
) {
  const view = root.ownerDocument.defaultView;
  let frameId: number | undefined;

  const measure = () => {
    frameId = undefined;
    const rootRect = root.getBoundingClientRect();

    const markers: DiagramGeometryPoint[] = Array.from(
      root.querySelectorAll<HTMLElement>("[data-diagram-marker]"),
      (node) => {
        const rect = node.getBoundingClientRect();
        return {
          id: node.dataset.diagramMarker ?? "",
          x: rect.left - rootRect.left + rect.width / 2,
          y: rect.top - rootRect.top + rect.height / 2,
        };
      },
    ).filter(({ id }) => id !== "");

    const notes: DiagramGeometryPoint[] = Array.from(
      root.querySelectorAll<HTMLElement>("[data-diagram-note]"),
      (node) => {
        const rect = node.getBoundingClientRect();
        const side = node.dataset.diagramNoteSide;
        return {
          id: node.dataset.diagramNote ?? "",
          x:
            side === "left"
              ? rect.right - rootRect.left
              : rect.left - rootRect.left,
          y: rect.top - rootRect.top + rect.height / 2,
        };
      },
    ).filter(({ id }) => id !== "");

    listener({
      width: rootRect.width,
      height: rootRect.height,
      markers,
      notes,
    });
  };

  const scheduleMeasure = () => {
    if (!view || frameId !== undefined) return;
    frameId = view.requestAnimationFrame(measure);
  };

  const ResizeObserverConstructor = view?.ResizeObserver;
  const resizeObserver = ResizeObserverConstructor
    ? new ResizeObserverConstructor(scheduleMeasure)
    : undefined;
  resizeObserver?.observe(root);
  for (const node of root.querySelectorAll(
    "[data-diagram-marker], [data-diagram-note]",
  )) {
    resizeObserver?.observe(node);
  }
  view?.addEventListener("resize", scheduleMeasure);
  scheduleMeasure();

  return () => {
    resizeObserver?.disconnect();
    view?.removeEventListener("resize", scheduleMeasure);
    if (view && frameId !== undefined) view.cancelAnimationFrame(frameId);
  };
}
