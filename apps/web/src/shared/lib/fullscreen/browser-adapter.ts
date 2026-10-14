/**
 * The whole screen for one block (Change 184 F10): the Fullscreen API where
 * the browser has it; the caller also covers the window, so a phone without
 * the API gets the same view. While open, the page under it does not scroll.
 */
export function openFullscreen(element: HTMLElement): void {
  if (document.fullscreenEnabled)
    void element.requestFullscreen().catch(() => undefined);
}

/**
 * Watches an open block: `onClose` runs when the browser leaves fullscreen or
 * Esc is pressed outside a handled key. Returns the cleanup, which also leaves
 * fullscreen and gives the page back its scroll.
 */
export function watchFullscreen(
  element: HTMLElement | null,
  onClose: () => void,
): () => void {
  const page = document.documentElement;
  const overflow = page.style.overflow;
  page.style.overflow = "hidden";
  const onChange = () => {
    if (!document.fullscreenElement) onClose();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && !event.defaultPrevented) onClose();
  };
  document.addEventListener("fullscreenchange", onChange);
  document.addEventListener("keydown", onKey);
  return () => {
    page.style.overflow = overflow;
    document.removeEventListener("fullscreenchange", onChange);
    document.removeEventListener("keydown", onKey);
    if (element && document.fullscreenElement === element)
      void document.exitFullscreen().catch(() => undefined);
  };
}
