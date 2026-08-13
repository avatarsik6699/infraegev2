type ActiveSectionListener = (id: string) => void;

export function observeActiveSection(
  ids: readonly string[],
  listener: ActiveSectionListener,
) {
  const targets = ids.flatMap((id) => {
    const element = document.getElementById(id);
    return element ? [{ element, id }] : [];
  });

  if (targets.length === 0) return () => undefined;

  let frameId: number | undefined;
  let activeId: string | undefined;

  const update = () => {
    frameId = undefined;
    const readingLine = window.innerHeight * 0.28;
    const passedTargets = targets.filter(
      ({ element }) => element.getBoundingClientRect().top <= readingLine,
    );
    const nextId = (passedTargets.at(-1) ?? targets[0])?.id;

    if (nextId && nextId !== activeId) {
      activeId = nextId;
      listener(nextId);
    }
  };

  const scheduleUpdate = () => {
    if (frameId !== undefined) return;
    frameId = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);

  return () => {
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    if (frameId !== undefined) window.cancelAnimationFrame(frameId);
  };
}
