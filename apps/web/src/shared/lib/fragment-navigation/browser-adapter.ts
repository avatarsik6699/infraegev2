export const fragmentNavigation = {
  focusAfterLayout(id: string) {
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const hadTabIndex = target.hasAttribute("tabindex");
      if (!hadTabIndex) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start", behavior: "instant" });
      if (!hadTabIndex) {
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          {
            once: true,
          },
        );
      }
    });
    return () => window.cancelAnimationFrame(frame);
  },
};
