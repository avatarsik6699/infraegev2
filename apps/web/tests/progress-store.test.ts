import { beforeEach, describe, expect, it } from "vitest";
import { isMastered, markMastered, progressRatio } from "~/lib/progress-store";

beforeEach(() => {
  window.localStorage.clear();
});

describe("progress-store", () => {
  it("nothing is mastered by default", () => {
    expect(isMastered("placeholder-topic")).toBe(false);
    expect(progressRatio(["a", "b"])).toBe(0);
  });

  it("marks an id as mastered and persists it", () => {
    markMastered("placeholder-topic");
    expect(isMastered("placeholder-topic")).toBe(true);
  });

  it("does not duplicate an id marked mastered twice", () => {
    markMastered("a");
    markMastered("a");
    expect(progressRatio(["a", "b"])).toBe(0.5);
  });

  it("returns 0 for an empty id list rather than dividing by zero", () => {
    expect(progressRatio([])).toBe(0);
  });
});
