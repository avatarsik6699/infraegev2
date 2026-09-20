import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonProgressProvider } from "~/features/lesson-progress";
import { CourseOverviewPage } from "~/pages/course-overview";
import { courseOverviewModel } from "~/pages/course-overview/model/course-overview-model";
import type { CourseOverviewPageTypes } from "~/pages/course-overview/course-overview-page.types";
import { courseProgress, type CourseTypes } from "~/entities/course";

vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => {
    const actual = await importOriginal();
    const RouterLink = ({
      children,
      params,
      to,
      ...props
    }: React.ComponentProps<"a"> & {
      to: string;
      params?: Record<string, string>;
    }) => {
      const href = Object.entries(params ?? {}).reduce(
        (path, [key, value]) => path.replace(`$${key}`, value),
        to,
      );
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    };

    return {
      ...actual,
      createLink:
        (Component: React.ComponentType<React.ComponentProps<"a">>) =>
        ({
          children,
          params,
          to,
          ...props
        }: React.ComponentProps<"a"> & {
          to: string;
          params?: Record<string, string>;
        }) => {
          const href = Object.entries(params ?? {}).reduce(
            (path, [key, value]) => path.replace(`$${key}`, value),
            to,
          );
          return (
            <Component href={href} {...props}>
              {children}
            </Component>
          );
        },
      Link: RouterLink,
    };
  },
);

const lessons: CourseTypes.LessonDefinition[] = [
  "first",
  "second",
  "third",
].map((id) => ({
  id,
  routeSlug: id,
  title: `Урок ${id}`,
  summary: "",
  theory: [],
  result: "",
  learningOutcomes: [],
  status: "published",
  accessTier: "free",
  masteryThreshold: 0.8,
}));
const props: CourseOverviewPageTypes.Props = {
  course: {
    id: "python",
    routeSlug: "python",
    title: "Python с нуля для ЕГЭ",
    summary: "От первой программы к самостоятельным задачам",
    audience: "",
    learningOutcomes: [],
    stage: "complete",
    status: "published",
    modules: [
      {
        id: "start",
        title: "Старт",
        summary: "",
        lessonPlan: lessons.slice(0, 2).map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          outcome: "Сохраненный результат",
        })),
      },
      {
        id: "final-program",
        title: "Финальный проект",
        summary: "",
        lessonPlan: [
          {
            id: "third",
            title: "Урок third",
            outcome: "Сохраненный результат",
          },
        ],
      },
    ],
  },
  lessons,
  practiceSummary: lessons.map((lesson) => ({
    id: lesson.id,
    tasks: Array.from({ length: 5 }, (_, index) => ({
      id: `${lesson.id}-${String(index)}`,
      solutionRevision: 2,
    })),
  })),
};
const model = (saved = {}, hydrated = true, input = props) =>
  courseOverviewModel.calculate(input, saved, hydrated);
const solved = (id: string, count: number) => ({
  solvedTaskIds: Array.from(
    { length: count },
    (_, index) => `${id}-${String(index)}`,
  ),
});
const overview = (input = props) => (
  <LessonProgressProvider>
    <CourseOverviewPage {...input} />
  </LessonProgressProvider>
);
const seed = (count: number, revision = 2) => {
  localStorage.setItem(
    "infraege:lesson-progress:v2",
    JSON.stringify({
      version: 1,
      data: {
        lessons: {
          first: {
            ...solved("first", count),
            acceptedAnswers: {},
            solvedRevisions: Object.fromEntries(
              solved("first", count).solvedTaskIds.map((id) => [
                id,
                { [String(revision)]: "5" },
              ]),
            ),
          },
        },
      },
    }),
  );
};
beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("course overview model", () => {
  it("starts at the first lesson and exposes real counts", () => {
    const result = model();
    expect(result.action).toMatchObject({
      label: "Начать курс",
      lesson: { id: "first" },
    });
    expect(result.progress).toEqual({
      status: "ready",
      solved: 0,
      total: 15,
      mastered: false,
    });
    expect(result.modules.map((module) => module.status)).toEqual([
      "Не начат",
      "Не начат",
    ]);
    expect(result.modules[1]?.lessons[0]?.number).toBe("2.1");
  });
  it("continues the first unmastered lesson at its actual threshold, not 100%", () => {
    const result = model({
      first: solved("first", 4),
      third: solved("third", 5),
    });
    expect(result.action).toMatchObject({
      continuing: true,
      lesson: { id: "second" },
    });
    expect(result.progress).toMatchObject({ solved: 9, total: 15 });
    expect(result.modules.map((module) => module.status)).toEqual([
      "В процессе",
      "Освоен",
    ]);
    expect(result.modules[0]?.lessons[0]?.progress).toMatchObject({
      solved: 4,
      mastered: true,
    });
  });
  it("offers repetition when all lessons are mastered", () => {
    const result = model(
      Object.fromEntries(
        lessons.map((lesson) => [lesson.id, solved(lesson.id, 4)]),
      ),
    );
    expect(result.action).toMatchObject({
      label: "Повторить курс",
      lesson: { id: "first" },
      continuing: false,
    });
    expect(result.progress).toMatchObject({
      mastered: true,
      solved: 12,
      total: 15,
    });
  });
  it("does not count unrelated solved IDs or master a zero-task lesson", () => {
    const input = {
      ...props,
      practiceSummary: props.practiceSummary!.map((lesson) =>
        lesson.id === "first" ? { ...lesson, tasks: [] } : lesson,
      ),
    };
    const result = model(
      { first: { solvedTaskIds: ["unrelated"] } },
      true,
      input,
    );
    expect(result.progress).toMatchObject({
      solved: 0,
      total: 10,
      mastered: false,
    });
    expect(result.modules[0]?.lessons[0]?.progress).toMatchObject({
      total: 0,
      mastered: false,
    });
  });
  it.each([null, [], props.practiceSummary!.slice(1)])(
    "rejects unavailable or incomplete summaries",
    (practiceSummary: CourseOverviewPageTypes.Props["practiceSummary"]) => {
      const result = model({ first: solved("first", 5) }, true, {
        ...props,
        practiceSummary,
      });
      expect(result.progress).toEqual({ status: "unavailable" });
      expect(result.action?.label).toBe("Открыть первый урок");
      expect(result.modules[0]?.lessons[0]?.progress).toEqual({
        status: "unavailable",
      });
    },
  );
  it("keeps SSR neutral even when saved progress is supplied", () => {
    expect(model({ first: solved("first", 5) }, false).progress).toEqual({
      status: "loading",
    });
    expect(model({}, false).action?.label).toBe("Открыть первый урок");
  });
  it("uses curriculum order rather than definition or summary order", () => {
    expect(
      model({}, true, {
        ...props,
        lessons: [...lessons].reverse(),
        practiceSummary: [...props.practiceSummary!].reverse(),
      }).action?.lesson.id,
    ).toBe("first");
  });
  it("respects per-lesson mastery thresholds without changing the catalog snapshot", () => {
    const summary = [
      {
        id: "a",
        tasks: [
          { id: "task", solutionRevision: 2 },
          { id: "other", solutionRevision: 2 },
        ],
        masteryThreshold: 0.5,
      },
    ];
    expect(
      courseProgress.calculatePractice(summary, {
        a: { solvedTaskIds: ["task", "task", "foreign"] },
      }),
    ).toMatchObject({
      solved: 1,
      total: 2,
      byLessonId: { a: { mastered: true } },
    });
    expect(
      courseProgress.calculate(summary, { a: { solvedTaskIds: ["task"] } }),
    ).toEqual({
      masteredLessonIds: ["a"],
      availableCount: 1,
      allAvailableMastered: true,
    });
  });
});

describe("course overview UI", () => {
  it("renders a usable native SSR curriculum with the same initial disclosure", () => {
    const html = renderToString(overview());
    const root = document.createElement("div");
    root.innerHTML = html;
    expect(root.querySelectorAll("[data-course-program] details")).toHaveLength(
      2,
    );
    expect(
      root.querySelectorAll("[data-course-program] details[open]"),
    ).toHaveLength(1);
    expect(
      root.querySelectorAll("[data-course-lesson-plan-item] a"),
    ).toHaveLength(3);
    expect(html).toContain("Открыть первый урок");
    expect(html).toContain("— из —");
    expect(html).not.toContain("Сохраненный результат");
    expect(html).not.toContain("Прочитано");
    expect(html).not.toContain("0 из 15");
  });
  it("supports independent disclosure and bulk expand/collapse", async () => {
    render(overview());
    const start = screen.getByRole("button", { name: /Старт/ });
    const project = screen.getByRole("button", { name: /Финальный проект/ });
    expect(start.getAttribute("aria-expanded")).toBe("true");
    expect(project.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(project);
    expect(start.getAttribute("aria-expanded")).toBe("true");
    expect(project.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Свернуть всё" }));
    expect(start.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "Развернуть всё" }));
    expect(project.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getAllByRole("link", { name: /Практика:/ })).toHaveLength(3);
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Начать курс" })).not.toBeNull(),
    );
  });
  it("shares revision-aware progress between rows, action and total", async () => {
    seed(4);
    render(overview());
    await waitFor(() =>
      expect(
        screen
          .getByRole("link", { name: "Продолжить: Урок second" })
          .getAttribute("href"),
      ).toBe("/courses/python/second"),
    );
    expect(
      screen
        .getByRole("progressbar", { name: "Решённые задачи курса" })
        .getAttribute("aria-valuenow"),
    ).toBe("4");
    expect(
      screen.getByRole("link", { name: /Урок first Урок освоен/ }),
    ).not.toBeNull();
    expect(
      screen
        .getByRole("link", { name: /1.2 Урок second/ })
        .hasAttribute("data-continuing"),
    ).toBe(true);
  });
  it("invalidates saved answers after a solution revision changes", async () => {
    seed(5, 1);
    render(overview());
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Начать курс" })).not.toBeNull(),
    );
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "0",
    );
  });
  it("retains lesson navigation when progress is unavailable", () => {
    render(overview({ ...props, practiceSummary: null }));
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe(
      "Прогресс временно недоступен",
    );
    expect(
      screen
        .getByRole("link", { name: "Открыть первый урок" })
        .getAttribute("href"),
    ).toBe("/courses/python/first");
    fireEvent.click(screen.getByRole("button", { name: "Развернуть всё" }));
    expect(
      within(
        screen.getByRole("region", { name: "Программа курса" }),
      ).getAllByRole("link"),
    ).toHaveLength(3);
  });
});
