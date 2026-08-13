import type { LessonOutlineGeometry } from "./lesson-outline-geometry";

type GeometryListener = (geometry: LessonOutlineGeometry) => void;

export function observeLessonOutlineGeometry(
  root: HTMLElement,
  listener: GeometryListener,
) {
  const view = root.ownerDocument.defaultView;
  let frameId: number | undefined;

  const measure = () => {
    frameId = undefined;
    const rootRect = root.getBoundingClientRect();
    const nodes = Array.from(
      root.querySelectorAll<SVGSVGElement>("[data-outline-node]"),
      (node) => {
        const rect = node.getBoundingClientRect();
        const kind = node.dataset.outlineNodeKind;
        return {
          id: node.dataset.outlineNodeId ?? "",
          groupId: node.dataset.outlineGroupId ?? "",
          kind: kind === "group" ? ("group" as const) : ("item" as const),
          x: rect.left - rootRect.left + rect.width / 2,
          y: rect.top - rootRect.top + rect.height / 2,
          radius: Math.min(rect.width, rect.height) / 2,
        };
      },
    ).filter(({ id, groupId }) => id !== "" && groupId !== "");

    listener({
      width: rootRect.width,
      height: rootRect.height,
      nodes,
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
  for (const node of root.querySelectorAll("[data-outline-node]")) {
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
