import { afterEach, describe, expect, it, vi } from "vitest";
import { elementActivity } from "~/shared/lib/element-activity";

type ObserverCallback = IntersectionObserverCallback;

class FakeIntersectionObserver {
  static callback: ObserverCallback | undefined;
  disconnect = vi.fn();
  observe = vi.fn();

  constructor(callback: ObserverCallback) {
    FakeIntersectionObserver.callback = callback;
  }
}

const setVisibility = (visibilityState: DocumentVisibilityState) => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: visibilityState,
  });
};

describe("elementActivity", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    FakeIntersectionObserver.callback = undefined;
    setVisibility("visible");
  });

  it("publishes viewport and document activity and cleans up", () => {
    const listener = vi.fn();
    const removeEventListener = vi.spyOn(document, "removeEventListener");
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    setVisibility("visible");

    const element = document.createElement("div");
    const cleanup = elementActivity.observe(element, listener);
    const entry = { isIntersecting: true } as IntersectionObserverEntry;
    FakeIntersectionObserver.callback?.([entry], {} as IntersectionObserver);

    expect(listener).toHaveBeenLastCalledWith(true);
    const calls = listener.mock.calls.length;
    FakeIntersectionObserver.callback?.([entry], {} as IntersectionObserver);
    expect(listener).toHaveBeenCalledTimes(calls);
    FakeIntersectionObserver.callback?.(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    expect(listener).toHaveBeenLastCalledWith(false);
    FakeIntersectionObserver.callback?.([entry], {} as IntersectionObserver);

    setVisibility("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(listener).toHaveBeenLastCalledWith(false);

    setVisibility("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(listener).toHaveBeenLastCalledWith(true);

    cleanup();
    expect(removeEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
  });

  it("keeps the static fallback inactive without an observer", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const listener = vi.fn();

    elementActivity.observe(document.createElement("div"), listener);

    expect(listener).toHaveBeenCalledWith(false);
  });
});
