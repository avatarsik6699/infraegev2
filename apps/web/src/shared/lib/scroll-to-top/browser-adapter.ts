const observe = (listener: (visible: boolean) => void): (() => void) => {
  let frame: number | undefined;
  const update = () => {
    frame = undefined;
    listener(window.scrollY >= window.innerHeight);
  };
  const schedule = () => {
    frame ??= window.requestAnimationFrame(update);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  schedule();
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame !== undefined) window.cancelAnimationFrame(frame);
  };
};

const scroll = (headingId: string): void => {
  document.getElementById(headingId)?.focus({ preventScroll: true });
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
};

let initialPageShown = false;

/** Moves focus to a new page heading after client navigation, never on the first load. */
const focusHeadingAfterNavigation = (headingId: string): void => {
  if (!initialPageShown) {
    initialPageShown = true;
    return;
  }
  if (window.location.hash) return;
  document.getElementById(headingId)?.focus({ preventScroll: true });
};

export const scrollToTop = { observe, scroll, focusHeadingAfterNavigation };
