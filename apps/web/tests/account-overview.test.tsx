import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  findCourseByRouteSlug,
  getCourseLessons,
  type CourseProgressTypes,
} from "~/entities/course";
import { topicCatalog } from "~/entities/topic-catalog";
import { AccountOverview } from "~/pages/account/components/account-overview";

const progressFixture = vi.hoisted(() => ({
  lessonStatus: "ready" as "ready" | "loading" | "error",
  hydrated: true,
  solvedTaskIds: [] as string[],
  solvedLessonId: "",
  lessonResults: {} as Record<string, { solvedTaskIds: string[] }>,
  practiceStatus: "ready" as "ready" | "loading" | "error",
  practiceHistory: {} as Record<string, Record<string, string>>,
}));

vi.mock("~/features/lesson-progress", () => ({
  useLessonProgressHydrated: () => progressFixture.hydrated,
  useLessonProgressStatus: () => progressFixture.lessonStatus,
  useLessonsProgress: (
    _lessonIds: readonly string[],
    versions?: readonly { id: string }[],
  ) => {
    if (!versions) return progressFixture.lessonResults;
    if (!progressFixture.solvedLessonId) return {};
    return {
      [progressFixture.solvedLessonId]: {
        solvedTaskIds: progressFixture.solvedTaskIds,
      },
    };
  },
}));

vi.mock("~/features/practice-progress", () => ({
  usePracticeProgress: (
    selector: (state: {
      history: Record<string, Record<string, string>>;
      status: "ready" | "loading" | "error";
    }) => unknown,
  ) =>
    selector({
      history: progressFixture.practiceHistory,
      status: progressFixture.practiceStatus,
    }),
}));

vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => {
    const actual = await importOriginal();
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
        }) => (
          <Component
            href={Object.entries(params ?? {}).reduce(
              (path, [key, value]) => path.replace(`$${key}`, value),
              to,
            )}
            {...props}
          >
            {children}
          </Component>
        ),
    };
  },
);

const course = findCourseByRouteSlug("python");
if (!course) throw new Error("Python course fixture is missing");
const published = getCourseLessons(course).filter(
  (lesson) => lesson.status === "published",
);
const summary: CourseProgressTypes.Lesson[] = published.map((lesson) => ({
  id: lesson.id,
  tasks: [{ id: `${lesson.id}-task`, solutionRevision: 1 }],
}));
const topic = topicCatalog.entries.find(
  (entry) => entry.status === "published",
);
if (!topic || topic.status !== "published")
  throw new Error("Published topic fixture is missing");

describe("AccountOverview", () => {
  beforeEach(() => {
    progressFixture.lessonStatus = "ready";
    progressFixture.hydrated = true;
    progressFixture.solvedTaskIds = [];
    progressFixture.solvedLessonId = "";
    progressFixture.lessonResults = {};
    progressFixture.practiceStatus = "ready";
    progressFixture.practiceHistory = {};
  });

  it("shows a text-only empty state only after every progress source is ready", () => {
    const { container } = render(<AccountOverview practiceSummary={summary} />);

    expect(screen.getByText("Пока нет сохранённых результатов")).not.toBeNull();
    expect(container.querySelector("img, svg")).toBeNull();
    expect(screen.queryByText("Курс Python")).toBeNull();
  });

  it("continues at the first unmastered course lesson using saved results", () => {
    progressFixture.solvedLessonId = published[0]?.id ?? "";
    progressFixture.solvedTaskIds = [`${progressFixture.solvedLessonId}-task`];
    progressFixture.lessonResults = {
      [progressFixture.solvedLessonId]: {
        solvedTaskIds: progressFixture.solvedTaskIds,
      },
    };
    render(<AccountOverview practiceSummary={summary} />);

    expect(
      screen.getByRole("link", { name: "Продолжить" }).getAttribute("href"),
    ).toBe(`/courses/python/${published[1]?.routeSlug}`);
  });

  it("keeps a course entry when results exist but its lesson summary is unavailable", () => {
    progressFixture.lessonResults = {
      [published[0]?.id ?? ""]: { solvedTaskIds: ["saved-task"] },
    };
    render(<AccountOverview practiceSummary={null} />);

    expect(screen.getByRole("link", { name: "Открыть курс" })).not.toBeNull();
    expect(screen.getByText("Прогресс временно недоступен")).not.toBeNull();
    expect(screen.queryByText("Пока нет сохранённых результатов")).toBeNull();
  });

  it("treats an incomplete course summary as unavailable instead of loading indefinitely", () => {
    render(<AccountOverview practiceSummary={[]} />);

    expect(screen.getByText("Прогресс временно недоступен")).not.toBeNull();
    expect(screen.queryByText("Загружаем прогресс…")).toBeNull();
    expect(screen.queryByText("Пока нет сохранённых результатов")).toBeNull();
  });

  it("uses catalog order for the topic continuation and aggregates standalone practice", () => {
    progressFixture.lessonResults = {
      [topic.id]: { solvedTaskIds: ["topic-task"] },
    };
    progressFixture.practiceHistory = {
      "z-task": { "1": "" },
      "a-task": { "1": "" },
    };
    render(<AccountOverview practiceSummary={summary} />);

    expect(
      screen.getByRole("link", { name: "Открыть тему" }).getAttribute("href"),
    ).toBe(`/ege/${topic.routeSlug}`);
    expect(
      screen
        .getByRole("link", { name: "Открыть практику" })
        .getAttribute("href"),
    ).toBe("/practice");
    expect(screen.getByText("Сохранено: 2 задания")).not.toBeNull();
  });

  it("keeps ready topic and practice continuations when the course summary is unavailable", () => {
    progressFixture.lessonResults = {
      [topic.id]: { solvedTaskIds: ["topic-task"] },
    };
    progressFixture.practiceHistory = { "task-id": { "1": "" } };
    render(<AccountOverview practiceSummary={null} />);

    expect(screen.getByText("Прогресс временно недоступен")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Открыть тему" })).not.toBeNull();
    expect(
      screen.getByRole("link", { name: "Открыть практику" }),
    ).not.toBeNull();
    expect(screen.queryByText("Пока нет сохранённых результатов")).toBeNull();
    expect(screen.queryByText(/Освоено 0 из/)).toBeNull();
  });
});
