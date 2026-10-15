import { describe, expect, it } from "vitest";
import { courseCatalog } from "~/entities/course";
import { russianCount } from "~/shared/lib/russian-count";

describe("one counting rule (Change 185, F8)", () => {
  it("names additional lessons and tasks after the main count", () => {
    expect(russianCount.additional(0, "lessons")).toBe("");
    expect(russianCount.additional(1, "lessons")).toBe(" + 1 дополнительный");
    expect(russianCount.additional(3, "lessons")).toBe(" + 3 дополнительных");
    expect(russianCount.additional(2, "tasks")).toBe(" + 2 дополнительные");
    expect(russianCount.additional(7, "tasks")).toBe(" + 7 дополнительных");
  });

  it("takes the main lesson count from the lessons progress counts", () => {
    const python = courseCatalog.entries.find((entry) => entry.id === "python");
    expect(python?.status).toBe("published");
    if (python?.status !== "published") return;
    expect(courseCatalog.coreLessonCount(python)).toBe(27);
  });
});
