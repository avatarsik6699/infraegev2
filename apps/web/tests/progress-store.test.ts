import { beforeEach, describe, expect, it } from "vitest";
import {
  getTopicProgress,
  isMastered,
  markMastered,
  progressRatio,
  recordCorrectTask,
} from "~/features/track-progress";

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

  it("stores distinct correct tasks per topic and reaches the configured threshold", () => {
    const taskIds = ["t1", "t2", "t3", "t4", "t5"];

    recordCorrectTask("topic-a", "t1", taskIds, 0.8);
    recordCorrectTask("topic-a", "t1", taskIds, 0.8);
    recordCorrectTask("topic-a", "t2", taskIds, 0.8);
    recordCorrectTask("topic-a", "t3", taskIds, 0.8);
    const progress = recordCorrectTask("topic-a", "t4", taskIds, 0.8);

    expect(progress).toEqual({
      correctCount: 4,
      totalCount: 5,
      ratio: 0.8,
      mastered: true,
    });
    expect(isMastered("topic-a")).toBe(true);
  });

  it("isolates topics and ignores unknown or duplicate ids in the complete task set", () => {
    recordCorrectTask("topic-a", "shared", ["shared", "shared"], 1);
    recordCorrectTask("topic-b", "not-in-topic", ["other"], 1);

    expect(getTopicProgress("topic-a", ["shared", "shared"]).ratio).toBe(1);
    expect(getTopicProgress("topic-b", ["other"]).ratio).toBe(0);
    expect(isMastered("topic-b")).toBe(false);
  });

  it("self-heals corrupt and stale localStorage envelopes", () => {
    window.localStorage.setItem(
      "infraege:progress",
      JSON.stringify({ version: 2, data: { masteredIds: "bad" } }),
    );

    expect(getTopicProgress("topic-a", ["t1"]).ratio).toBe(0);
    expect(window.localStorage.getItem("infraege:progress")).toBeNull();

    window.localStorage.setItem(
      "infraege:progress",
      JSON.stringify({
        version: 1,
        data: { masteredIds: ["topic-a"] },
      }),
    );
    expect(isMastered("topic-a")).toBe(false);
    expect(window.localStorage.getItem("infraege:progress")).toBeNull();
  });
});
