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
    // A section the learner navigated to stays current while it starts at
    // the top, even when it is shorter than the reading line (Change 171).
    const hash = window.location.hash.slice(1);
    const navigated = targets.find(
      ({ id }) => id === hash || encodeURIComponent(id) === hash,
    );
    const navigatedTop = navigated?.element.getBoundingClientRect().top;
    const nextId =
      navigated &&
      navigatedTop !== undefined &&
      navigatedTop >= -1 &&
      navigatedTop <= readingLine
        ? navigated.id
        : (passedTargets.at(-1) ?? targets[0])?.id;

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
  window.addEventListener("hashchange", scheduleUpdate);

  return () => {
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    window.removeEventListener("hashchange", scheduleUpdate);
    if (frameId !== undefined) window.cancelAnimationFrame(frameId);
  };
}
