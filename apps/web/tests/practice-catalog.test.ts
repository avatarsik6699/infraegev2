import { routerSearch } from "~/app/lib/router-search";
import { beforeEach, describe, expect, it } from "vitest";
import { practiceCatalog } from "~/entities/practice-task/practice-catalog";
import { practiceProgress } from "~/features/practice-progress/model/practice-progress";
import { practiceAnswerFormat } from "~/entities/practice-task/practice-answer-format";

it("uses authored answer guidance without guessing unclassified formats", () => {
  expect(
    practiceAnswerFormat.label(
      "Запишите целое число в десятичной системе счисления.",
    ),
  ).toBe("Целое число");
  expect(
    practiceAnswerFormat.label(
      "Введите ответ по условию задачи. Порядок значений важен.",
    ),
  ).toBe("По условию");
  expect(practiceAnswerFormat.label("Введите два числа через пробел.")).toBe(
    "Введите два числа через пробел.",
  );
  expect(practiceAnswerFormat.label()).toBe("По условию");
});

describe("practice catalog URL state", () => {
  it("keeps repeated topic parameters across router serialization and hydration", () => {
    const state = { topics: ["ege-16", "ege-5"], q: "рекурс", page: 2 };
    const url = routerSearch.stringify(state);
    expect(new URLSearchParams(url).getAll("topics")).toEqual(state.topics);
    expect(routerSearch.parse(url)).toEqual(state);
    expect(routerSearch.parse("?q=0016").q).toBe("0016");
    expect(routerSearch.parse(routerSearch.stringify({ q: "16" })).q).toBe(
      "16",
    );
    expect(routerSearch.stringify({ q: "test", page: 2 })).toBe(
      "?page=2&q=test",
    );
  });
  it("normalizes multi-topic search and preserves the complete detail context", () => {
    const state = practiceCatalog.search({
      q: " рекурс ",
      topics: ["ege-16", "ege-5", "ege-16"],
      sort: "difficulty_desc",
      limit: "10",
      page: "2",
    });
    expect(state).toEqual({
      q: "рекурс",
      topics: ["ege-16", "ege-5"],
      sort: "difficulty_desc",
      limit: 10,
      page: 2,
    });
    const href = practiceCatalog.taskHref("task", state);
    expect(
      new URL(href, "https://example.test").searchParams.getAll("topics"),
    ).toEqual(["ege-16", "ege-5"]);
    expect(practiceCatalog.taskSearch(state)).toEqual(state);
    expect(practiceCatalog.search({ sort: "default" })).toEqual({});
  });
  it.each([
    { topics: ["../"] },
    { q: "a".repeat(201) },
    { limit: 11 },
    { sort: "random" },
  ])("rejects invalid catalog controls %j", (input) => {
    expect(practiceCatalog.search(input).invalid).toBe(true);
  });
  it.each([
    [1, "1 задание"],
    [2, "2 задания"],
    [11, "11 заданий"],
    [21, "21 задание"],
    [255, "255 заданий"],
  ])("declines counts %s", (count, label) => {
    expect(practiceCatalog.countLabel(count as number)).toBe(label);
  });
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

describe("account-scoped practice history", () => {
  beforeEach(() => localStorage.clear());
  it("retains revision facts without retaining submitted answers", () => {
    const first = practiceProgress.record({}, "task", 1);
    expect(first.task?.[2]).toBeUndefined();
    expect(practiceProgress.record(first, "task", 2)).toEqual({
      task: { "1": true, "2": true },
    });
    expect(practiceProgress.record(first, "task", 1)).toEqual({
      task: { "1": true },
    });
  });
  it("rejects guest writes while retaining member facts outside browser storage", () => {
    const oldLesson = '{"version":1,"data":{"lessons":{}}}';
    localStorage.setItem("infraege:lesson-progress:v2", oldLesson);
    localStorage.setItem(
      "infraege:practice-progress",
      '{"history":{"task":{"1":"old"}}}',
    );
    const guestStore = practiceProgress.create();
    guestStore.getState().markSolved("task", 1);
    expect(guestStore.getState().history).toEqual({});

    const store = practiceProgress.create("account-1");
    store.getState().markSolved("task", 1);
    const second = practiceProgress.create();
    expect(store.getState().history).toEqual({ task: { "1": true } });
    expect(second.getState().history).toEqual({});
    expect(localStorage.getItem("infraege:lesson-progress:v2")).toBe(oldLesson);
    expect(localStorage.getItem("infraege:practice-progress")).toContain("old");
  });
  it("hydrates only standalone results from the server projection", () => {
    const store = practiceProgress.create();
    store.getState().replaceFromServer([
      { context_kind: "standalone", task_id: "task", solution_revision: 2 },
      { context_kind: "topic_lesson", task_id: "other", solution_revision: 2 },
    ]);
    expect(store.getState().history).toEqual({ task: { "2": true } });
    expect(store.getState().hydrated).toBe(true);
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
