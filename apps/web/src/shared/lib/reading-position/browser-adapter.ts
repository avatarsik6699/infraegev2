import { calculateReadingPosition } from "./reading-position";

export function observeReadingPosition(
  article: HTMLElement,
  listener: (progress: number) => void,
): () => void {
  const view = article.ownerDocument.defaultView;
  if (!view) return () => undefined;

  let frameId: number | undefined;

  const update = () => {
    frameId = undefined;
    const rect = article.getBoundingClientRect();
    const articleTop = rect.top + view.scrollY;
    listener(
      calculateReadingPosition(
        view.scrollY,
        articleTop,
        article.offsetHeight,
        view.innerHeight,
      ),
    );
  };

  const scheduleUpdate = () => {
    if (frameId !== undefined) return;
    frameId = view.requestAnimationFrame(update);
  };

  const ResizeObserverConstructor = view.ResizeObserver;
  const resizeObserver = ResizeObserverConstructor
    ? new ResizeObserverConstructor(scheduleUpdate)
    : undefined;
  resizeObserver?.observe(article);
  view.addEventListener("scroll", scheduleUpdate, { passive: true });
  view.addEventListener("resize", scheduleUpdate);
  update();

  return () => {
    resizeObserver?.disconnect();
    view.removeEventListener("scroll", scheduleUpdate);
    view.removeEventListener("resize", scheduleUpdate);
    if (frameId !== undefined) view.cancelAnimationFrame(frameId);
  };
}
