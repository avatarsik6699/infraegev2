import { beforeEach, describe, expect, it } from "vitest";
import { practiceCatalog } from "~/entities/practice-task/practice-catalog";
import { practiceProgress } from "~/features/practice-progress/model/practice-progress";
import { safeLs } from "~/shared/lib/safe-ls";

describe("practice catalog URL state", () => {
  it("round-trips the filters and page without retaining a page after filter reset", () => {
    const search = practiceCatalog.search({
      skill: "python",
      exam_number: "17",
      difficulty: "2",
      page: 2,
    });
    expect(search).toEqual({
      skill: "python",
      exam_number: 17,
      difficulty: 2,
      page: 2,
    });
    expect(practiceCatalog.href(search)).toBe(
      "/practice?skill=python&exam_number=17&difficulty=2&page=2",
    );
    expect(practiceCatalog.href({ ...search, page: undefined })).not.toContain(
      "page",
    );
  });
  it.each([
    { skill: "../" },
    { difficulty: "4" },
    { exam_number: "0" },
    { exam_number: [] },
    { page: "0" },
  ])("rejects invalid input %j", (input) => {
    expect(practiceCatalog.search(input).invalid).toBe(true);
  });
  it("preserves an invalid result through the server validation boundary", () => {
    const invalid = practiceCatalog.search({ exam_number: "28" });
    expect(practiceCatalog.search(invalid).invalid).toBe(true);
  });
  it("accepts empty GET form fields as an unfiltered catalog", () => {
    expect(
      practiceCatalog.search({ skill: "", difficulty: "", exam_number: "" }),
    ).toEqual({});
  });
});

describe("independent practice history", () => {
  beforeEach(() => localStorage.clear());
  it("preserves previous revision answers without granting the new revision", () => {
    const first = practiceProgress.record({}, "task", 1, "old");
    expect(first.task?.[2]).toBeUndefined();
    expect(practiceProgress.record(first, "task", 2, "new")).toEqual({
      task: { "1": "old", "2": "new" },
    });
    expect(practiceProgress.record(first, "task", 1, "repeated")).toEqual({
      task: { "1": "repeated" },
    });
  });
  it("persists accepted values across stores without touching lesson progress", async () => {
    const oldLesson = '{"version":1,"data":{"lessons":{}}}';
    localStorage.setItem("infraege:lesson-progress:v2", oldLesson);
    const store = practiceProgress.create();
    await store.persist.rehydrate();
    store.getState().markSolved("task", 1, "42");
    const second = practiceProgress.create();
    await second.persist.rehydrate();
    expect(second.getState().history).toEqual({ task: { "1": "42" } });
    expect(localStorage.getItem("infraege:lesson-progress:v2")).toBe(oldLesson);
    expect(safeLs.get(practiceProgress.definition)?.history).toEqual({
      task: { "1": "42" },
    });
  });
  it.each([
    null,
    { history: [] },
    { history: { task: { "0": "42" } } },
    { history: { task: { "1": 42 } } },
  ])("rejects corrupt storage %j", (value) => {
    expect(practiceProgress.isStored(value)).toBe(false);
  });
});

describe("standalone catalog context", () => {
  it("round-trips a filtered page across next-task links", () => {
    const context = practiceCatalog.taskSearch({
      skill: "recursion",
      exam_number: "16",
      page: "2",
    });
    expect(practiceCatalog.taskHref("task-31", context)).toBe(
      "/practice/task-31?skill=recursion&exam_number=16&page=2",
    );
    expect(practiceCatalog.returnHref(context)).toBe(
      "/practice?skill=recursion&exam_number=16&page=2",
    );
  });
  it("rejects external return URLs and invalid origin/filters", () => {
    expect(
      practiceCatalog.returnHref(
        practiceCatalog.taskSearch({
          returnTo: "https://evil.invalid",
          origin: "//evil.invalid",
        }),
      ),
    ).toBe("/practice");
    expect(
      practiceCatalog.taskSearch({ exam_number: 99, origin: "valid" }),
    ).toEqual({});
  });
});
