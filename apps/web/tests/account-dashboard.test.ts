import { describe, expect, it } from "vitest";
import { accountDashboard } from "~/pages/account/model/account-dashboard";

const tasks = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${String(index)}`,
    solutionRevision: 1,
  }));

const base = {
  courseTitle: "Python",
  courseRouteSlug: "python",
  courseLessons: [
    { id: "l1", title: "Первая", routeSlug: "first", tasks: tasks("l1", 5) },
    { id: "l2", title: "Вторая", routeSlug: "second", tasks: tasks("l2", 5) },
  ],
  topics: [
    {
      id: "t1",
      title: "Рекурсия",
      routeSlug: "16-rekursiya",
      taskLabel: "Задание 16",
      tasks: tasks("t1", 4),
    },
    {
      id: "t2",
      title: "Строки",
      routeSlug: "24-stroki",
      taskLabel: "Задание 24",
      tasks: tasks("t2", 2),
    },
  ],
  progress: {},
  saved: {},
  course: { ready: true },
  topicsSource: { ready: true },
  practice: { ready: true, saved: 0 },
};

describe("account dashboard", () => {
  it("invites to start when nothing is saved", () => {
    const dashboard = accountDashboard(base);
    expect(dashboard.nextStep?.kind).toBe("start");
    expect(dashboard.continuations).toEqual([]);
    expect(dashboard.topics).toMatchObject({ solved: 0, total: 6, started: 0 });
  });

  it("puts the started course first and keeps the rest as continuations", () => {
    const progress = {
      l1: { solvedTaskIds: ["l1-0", "l1-1", "l1-2", "l1-3"] },
      t1: { solvedTaskIds: ["t1-0"] },
    };
    const dashboard = accountDashboard({
      ...base,
      progress,
      saved: progress,
      practice: { ready: true, saved: 3 },
    });
    expect(dashboard.course).toMatchObject({ mastered: 1, total: 2 });
    expect(dashboard.nextStep).toMatchObject({
      kind: "course",
      title: "Вторая",
      description: "Python · освоено 1 из 2 уроков",
      lessonRouteSlug: "second",
      action: "Продолжить",
    });
    expect(dashboard.continuations.map((step) => step.kind)).toEqual([
      "topic",
      "practice",
    ]);
    expect(dashboard.topics).toMatchObject({ solved: 1, started: 1 });
  });

  it("prefers an unfinished topic over a finished one", () => {
    const progress = {
      t1: { solvedTaskIds: ["t1-0", "t1-1", "t1-2", "t1-3"] },
      t2: { solvedTaskIds: ["t2-0"] },
    };
    const dashboard = accountDashboard({ ...base, progress, saved: progress });
    expect(dashboard.nextStep).toMatchObject({
      kind: "topic",
      routeSlug: "24-stroki",
      description: "Решено 1 из 2",
    });
  });

  it("keeps saved topic and practice entries when the course summary is unavailable", () => {
    const saved = {
      l1: { solvedTaskIds: ["l1-0"] },
      t1: { solvedTaskIds: ["t1-0"] },
    };
    const dashboard = accountDashboard({
      ...base,
      progress: saved,
      saved,
      course: { ready: false },
      practice: { ready: true, saved: 1 },
    });
    expect(dashboard.course).toBeUndefined();
    expect(dashboard.nextStep).toMatchObject({
      kind: "course",
      action: "Открыть курс",
    });
    expect(dashboard.continuations.map((step) => step.kind)).toEqual([
      "topic",
      "practice",
    ]);
  });
});
