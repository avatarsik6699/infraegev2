import { afterEach, describe, expect, it, vi } from "vitest";
import { reportProductEvent } from "~/features/product-analytics";
import { analyticsConsentStore } from "~/shared/lib/analytics";

describe("reportProductEvent", () => {
  afterEach(() => {
    analyticsConsentStore.remove();
    delete (window as Window & { umami?: unknown }).umami;
  });

  it("does not report before explicit consent", () => {
    const track = vi.fn();
    (window as Window & { umami?: { track: typeof track } }).umami = { track };

    reportProductEvent({
      name: "lesson_opened",
      properties: { lesson: "16-rekursiya" },
    });

    expect(track).not.toHaveBeenCalled();
  });

  it("reports only bounded allowlisted properties after consent", () => {
    const track = vi.fn();
    (window as Window & { umami?: { track: typeof track } }).umami = { track };
    analyticsConsentStore.set("granted");

    reportProductEvent({
      name: "practice_answer_checked",
      properties: { lesson: "16-rekursiya", result: "correct" },
    });
    reportProductEvent({
      name: "lesson_opened",
      properties: { lesson: "x".repeat(81) },
    });

    expect(track).toHaveBeenCalledOnce();
    expect(track).toHaveBeenCalledWith("practice_answer_checked", {
      lesson: "16-rekursiya",
      result: "correct",
    });
  });
});
