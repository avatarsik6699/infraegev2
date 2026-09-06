type ElementActivityListener = (active: boolean) => void;

const observe = (
  element: Element,
  listener: ElementActivityListener,
): (() => void) => {
  const ownerDocument = element.ownerDocument;
  const view = ownerDocument.defaultView;
  const Observer = view?.IntersectionObserver;

  if (!view || !Observer) {
    listener(false);
    return () => undefined;
  }

  let intersecting = false;
  let previousActivity: boolean | undefined;

  const publishActivity = () => {
    const active = intersecting && ownerDocument.visibilityState === "visible";
    if (active === previousActivity) return;

    previousActivity = active;
    listener(active);
  };

  const observer = new Observer((entries) => {
    intersecting = entries.some((entry) => entry.isIntersecting);
    publishActivity();
  });
  const handleVisibilityChange = () => publishActivity();

  observer.observe(element);
  ownerDocument.addEventListener("visibilitychange", handleVisibilityChange);
  publishActivity();

  return () => {
    observer.disconnect();
    ownerDocument.removeEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );
  };
};

export const elementActivity = { observe };
