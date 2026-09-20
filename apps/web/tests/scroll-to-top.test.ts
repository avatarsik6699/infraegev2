import { afterEach, describe, expect, it, vi } from "vitest";
import { scrollToTop } from "~/shared/lib/scroll-to-top";

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("return to page start", () => {
  it("tracks one viewport, resize and upward scrolling, then removes pending work", () => {
    vi.useFakeTimers({
      toFake: ["requestAnimationFrame", "cancelAnimationFrame"],
    });
    vi.stubGlobal("innerHeight", 800);
    vi.stubGlobal("scrollY", 0);
    const listener = vi.fn();
    const stop = scrollToTop.observe(listener);
    vi.advanceTimersToNextFrame();
    expect(listener).toHaveBeenLastCalledWith(false);
    vi.stubGlobal("scrollY", 900);
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersToNextFrame();
    expect(listener).toHaveBeenLastCalledWith(true);
    expect(listener).toHaveBeenCalledTimes(2);
    vi.stubGlobal("innerHeight", 1000);
    window.dispatchEvent(new Event("resize"));
    vi.advanceTimersToNextFrame();
    expect(listener).toHaveBeenLastCalledWith(false);
    vi.stubGlobal("scrollY", 1500);
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersToNextFrame();
    expect(listener).toHaveBeenLastCalledWith(true);
    vi.stubGlobal("scrollY", 50);
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersToNextFrame();
    expect(listener).toHaveBeenLastCalledWith(false);
    window.dispatchEvent(new Event("scroll"));
    stop();
    listener.mockClear();
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersToNextFrame();
    expect(listener).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    "focuses the heading without jumping; reduced motion %s",
    (reduced) => {
      const heading = document.createElement("h1");
      heading.id = "lesson-title";
      heading.tabIndex = -1;
      document.body.append(heading);
      const focus = vi.spyOn(heading, "focus");
      const scroll = vi
        .spyOn(window, "scrollTo")
        .mockImplementation(() => undefined);
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: reduced }),
      );
      scrollToTop.scroll(heading.id);
      expect(document.activeElement).toBe(heading);
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
      expect(scroll).toHaveBeenCalledWith({
        top: 0,
        behavior: reduced ? "instant" : "smooth",
      });
    },
  );
});
