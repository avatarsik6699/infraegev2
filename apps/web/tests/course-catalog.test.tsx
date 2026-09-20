import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonProgressProvider } from "~/features/lesson-progress";
import { CourseCatalogPage } from "~/pages/course-catalog";
import { courseCatalogModel } from "~/pages/course-catalog/model/course-catalog-model";
import type { CourseCatalogTypes } from "~/entities/course";

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

const lessons = Array.from({ length: 28 }, (_, index) => ({
  id: `lesson-${String(index)}`,
  tasks: [{ id: `task-${String(index)}`, solutionRevision: 2 }],
}));
const catalog = (summaries = { python: lessons }) => (
  <LessonProgressProvider>
    <CourseCatalogPage summaries={summaries} />
  </LessonProgressProvider>
);
beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("mini-course catalog", () => {
  it.each([0, 1, 28])(
    "shares %i mastered lessons across header and card",
    async (count: number) => {
      localStorage.setItem(
        "infraege:lesson-progress:v2",
        JSON.stringify({
          version: 1,
          data: {
            lessons: Object.fromEntries(
              lessons.slice(0, count).map((lesson) => [
                lesson.id,
                {
                  solvedTaskIds: [lesson.tasks[0]!.id],
                  acceptedAnswers: {},
                  solvedRevisions: { [lesson.tasks[0]!.id]: { "2": "5" } },
                },
              ]),
            ),
          },
        }),
      );
      const view = render(catalog());
      await waitFor(() =>
        expect(
          screen.getAllByText(`Освоено ${String(count)} из 28 уроков`),
        ).toHaveLength(2),
      );
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe(String(count));
      expect(
        view.container.querySelectorAll("[data-course-card]"),
      ).toHaveLength(4);
      expect(
        view.container.querySelectorAll(
          '[data-course-status="planned"] a, [data-course-status="planned"] button',
        ),
      ).toHaveLength(0);
      expect(
        screen.getByRole("link", { name: "Открыть курс" }).getAttribute("href"),
      ).toBe("/courses/python");
      expect(screen.queryByRole("searchbox")).toBeNull();
      expect(
        view.container.querySelectorAll("[data-course-card] img[alt='']"),
      ).toHaveLength(4);
      expect(
        view.container.querySelector("[data-course-summary]")?.textContent,
      ).toContain("Всего направлений: 4 · Доступно: 1 · Уроков: 28");
    },
  );

  it("invalidates old revisions without changing catalog totals", async () => {
    localStorage.setItem(
      "infraege:lesson-progress:v2",
      JSON.stringify({
        version: 1,
        data: {
          lessons: {
            "lesson-0": {
              solvedTaskIds: ["task-0"],
              acceptedAnswers: {},
              solvedRevisions: { "task-0": { "1": "5" } },
            },
          },
        },
      }),
    );
    render(catalog());
    await waitFor(() =>
      expect(screen.getAllByText("Освоено 0 из 28 уроков")).toHaveLength(2),
    );
  });

  it("renders neutral personal state on SSR while retaining real navigation", () => {
    const html = renderToString(catalog());
    expect(html).toContain("Прогресс загружается");
    expect(html).not.toContain("Освоено 0");
    expect(html).toContain('href="/courses/python"');
    expect(html).toContain("Скоро");
    expect(html).not.toContain("В плане");
  });

  it("preserves navigation and totals on missing summaries without a false zero", async () => {
    render(
      <LessonProgressProvider>
        <CourseCatalogPage summaries={{ python: null }} />
      </LessonProgressProvider>,
    );
    await waitFor(() =>
      expect(
        screen
          .getAllByRole("status")
          .filter(
            (status) => status.textContent === "Прогресс временно недоступен",
          ),
      ).toHaveLength(2),
    );
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText("Освоено 0 из 28 уроков")).toBeNull();
    expect(screen.getByRole("link", { name: "Открыть курс" })).not.toBeNull();
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
    },
    {
      id: "excel",
      status: "published",
      title: "Excel",
      summary: "",
      routeSlug: "excel",
      lessonCount: 1,
    },
  ];
  const result = courseCatalogModel.calculate(
    entries,
    { python: [lessons[0]!] },
    { "lesson-0": { solvedTaskIds: ["task-0"] } },
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
