import {
  courseLessonPublications,
  coursePublications,
} from "~/entities/course";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonProgressProvider } from "~/features/lesson-progress";
import { CourseCatalogPage } from "~/pages/course-catalog";
import { courseCatalogModel } from "~/pages/course-catalog/model/course-catalog-model";
import type { CourseCatalogTypes } from "~/entities/course";

const progressFixture = vi.hoisted(() => ({
  results: [] as {
    context_kind: "course_lesson";
    context_id: string;
    task_id: string;
    solution_revision: number;
  }[],
}));
vi.mock("~/features/account", () => ({
  useAccountSession: () => ({
    account: { id: "member" },
    status: "ready",
    csrfToken: "test",
  }),
}));

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

// The real lesson ids of each published course: the additional lessons (the
// last three of Python, the last one of Excel) stay out of mastery.
const summaryOf = (courseId: string) =>
  courseLessonPublications
    .filter((lesson) =>
      coursePublications
        .find((course) => course.id === courseId)
        ?.modules.some((m) => m.lessonPlan.some((p) => p.id === lesson.id)),
    )
    .map((lesson, index) => ({
      id: lesson.id,
      tasks: [{ id: `${courseId}-task-${String(index)}`, solutionRevision: 2 }],
    }));
const lessons = summaryOf("python");
const excelLessons = summaryOf("excel");
const catalog = (summaries = { python: lessons, excel: excelLessons }) => (
  <LessonProgressProvider accountId="member">
    <CourseCatalogPage summaries={summaries} />
  </LessonProgressProvider>
);
beforeEach(() => {
  progressFixture.results = [];
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(Response.json({ results: progressFixture.results })),
      ),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("mini-course catalog", () => {
  it.each([0, 1, 27])(
    "shares %i mastered lessons across header and card",
    async (count: number) => {
      progressFixture.results = lessons.slice(0, count).map((lesson) => ({
        context_kind: "course_lesson" as const,
        context_id: lesson.id,
        task_id: lesson.tasks[0]!.id,
        solution_revision: 2,
      }));
      const view = render(catalog());
      // the header totals both published courses: 27 + 14 core lessons
      await waitFor(() =>
        expect(
          screen.getAllByText(`Освоено ${String(count)} из 27 уроков`),
        ).toHaveLength(1),
      );
      expect(
        screen.getAllByText(`Освоено ${String(count)} из 41 урока`),
      ).toHaveLength(1);
      expect(screen.getAllByText("Освоено 0 из 14 уроков")).toHaveLength(1);
      expect(
        view.container.querySelectorAll("[data-course-card]"),
      ).toHaveLength(4);
      // Change 170 F34: planned courses offer no link, only a disabled «Скоро».
      expect(
        view.container.querySelectorAll('[data-course-status="planned"] a'),
      ).toHaveLength(0);
      expect(
        [
          ...view.container.querySelectorAll<HTMLButtonElement>(
            '[data-course-status="planned"] button',
          ),
        ].map((button) => [button.textContent, button.disabled]),
      ).toEqual(Array(2).fill(["Скоро", true]));
      expect(
        screen
          .getAllByRole("link", { name: "Открыть курс" })
          .map((link) => link.getAttribute("href")),
      ).toEqual(["/courses/python", "/courses/excel"]);
      expect(screen.queryByRole("searchbox")).toBeNull();
      expect(
        view.container.querySelectorAll(
          '[data-course-card="python"] [data-object-illustration="course-python-wide"]',
        ),
      ).toHaveLength(1);
      expect(
        view.container.querySelectorAll(
          '[data-course-status="planned"] [data-illustration-placeholder]',
        ),
      ).toHaveLength(2);
      expect(
        view.container.querySelector("[data-course-summary]")?.textContent,
      ).toContain("Всего направлений: 4 · Доступно: 2 · Уроков: 41");
    },
  );

  it("invalidates old revisions without changing catalog totals", async () => {
    progressFixture.results = [
      {
        context_kind: "course_lesson",
        context_id: lessons[0]!.id,
        task_id: lessons[0]!.tasks[0]!.id,
        solution_revision: 1,
      },
    ];
    render(catalog());
    await waitFor(() =>
      expect(screen.getAllByText("Освоено 0 из 27 уроков")).toHaveLength(1),
    );
  });

  it("renders neutral personal state on SSR while retaining real navigation", () => {
    const html = renderToString(catalog());
    expect(html).toContain("Прогресс загружается");
    expect(html).not.toContain("Освоено 0 из 27");
    expect(html).toContain('href="/courses/python"');
    expect(html).toContain("Скоро");
    expect(html).not.toContain("В плане");
  });

  it("preserves navigation and totals on missing summaries without a false zero", async () => {
    render(
      <LessonProgressProvider accountId="member">
        <CourseCatalogPage summaries={{ python: null, excel: null }} />
      </LessonProgressProvider>,
    );
    await waitFor(() =>
      expect(
        screen
          .getAllByRole("status")
          .filter(
            (status) => status.textContent === "Прогресс временно недоступен",
          ),
      ).toHaveLength(3),
    );
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText("Освоено 0 из 27 уроков")).toBeNull();
    expect(screen.getAllByRole("link", { name: "Открыть курс" })).toHaveLength(
      2,
    );
  });
});

it("never reports partial totals as complete when another published summary is missing", () => {
  const entries: CourseCatalogTypes.Entry[] = [
    {
      id: "python",
      status: "published",
      title: "Python",
      summary: "",
      routeSlug: "python",
      lessonCount: 1,
      advancedLessonIds: [],
    },
    {
      id: "excel",
      status: "published",
      title: "Excel",
      summary: "",
      routeSlug: "excel",
      lessonCount: 1,
      advancedLessonIds: [],
    },
  ];
  const result = courseCatalogModel.calculate(
    entries,
    { python: [lessons[0]!] },
    { [lessons[0]!.id]: { solvedTaskIds: [lessons[0]!.tasks[0]!.id] } },
    true,
  );
  expect(result.total).toBe(2);
  expect(result.byId.python).toEqual({
    status: "ready",
    mastered: 1,
    total: 1,
  });
  expect(result.byId.excel).toEqual({ status: "unavailable" });
  expect(result.summary).toEqual({ status: "unavailable" });
  expect(
    courseCatalogModel.calculate(entries, { python: [] }, {}, true).byId.python,
  ).toEqual({ status: "unavailable" });
});

it.each([
  [1, "1 урок"],
  [2, "2 урока"],
  [11, "11 уроков"],
  [21, "21 урок"],
  [28, "28 уроков"],
] as const)("formats lesson count %i", (count: number, copy: string) => {
  expect(courseCatalogModel.lessonCount(count)).toBe(copy);
});
