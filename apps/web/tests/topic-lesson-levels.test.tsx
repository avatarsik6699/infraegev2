import { render as baseRender, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { divisorsAndMasksLesson, lessonSubtopics } from "~/entities/lesson";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { LessonProgressProvider } from "~/features/lesson-progress";
import { TopicPracticePage, TopicSubtopicPage } from "~/pages/topic-lesson";
import { LessonProgressPanel } from "~/widgets/lesson-progress-panel";
import { SubtopicNavigation } from "~/widgets/subtopic-navigation";

vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  useRouter: () => ({ invalidate: () => undefined }),
  useRouterState: (options: {
    select: (state: { location: { pathname: string } }) => unknown;
  }) => options.select({ location: { pathname: "/ege/25-deliteli-i-maski" } }),
  Link: (props: {
    children?: React.ReactNode;
    to?: string;
    params?: Record<string, string>;
  }) => <a href={props.to}>{props.children}</a>,
}));
vi.mock("~/shared/components/action-link", () => ({
  ActionLink: (props: { children?: React.ReactNode }) => (
    <a>{props.children}</a>
  ),
}));
vi.mock("~/shared/components/scroll-to-top", () => ({
  ScrollToTop: () => null,
}));
vi.mock("~/features/reading-position", () => ({
  ReadingPositionIndicator: () => null,
}));
vi.mock("~/features/account", () => ({
  useAccountSession: () => ({ status: "ready", account: null, csrfToken: "" }),
  accountApi: {},
}));
vi.mock("~/features/lesson-practice", () => ({
  checkPracticeAnswer: () => undefined,
  createCheckAndSaveAnswer: () => () => undefined,
}));
vi.mock(
  "~/shared/components/learning-content",
  async (
    importOriginal: () => Promise<
      typeof import("~/shared/components/learning-content")
    >,
  ) => ({
    ...(await importOriginal()),
    LessonTheory: () => <div>Теория урока</div>,
  }),
);
vi.mock("~/widgets/lesson-outline", () => ({
  PageOutline: (props: { items: readonly { id: string; label: string }[] }) => (
    <nav aria-label="На этой странице">
      {props.items.map((item) => item.label).join(" | ")}
    </nav>
  ),
}));
vi.mock("~/widgets/public-header", () => ({ PublicHeader: () => null }));
vi.mock("~/widgets/public-footer", () => ({ PublicFooter: () => null }));
vi.mock("~/shared/components/breadcrumbs", () => ({ Breadcrumbs: () => null }));
vi.mock("~/pages/topic-lesson/components/legacy-section-redirect", () => ({
  LegacySectionRedirect: () => null,
}));
vi.mock("~/widgets/lesson-practice-flow", () => ({
  LessonPracticeFlow: () => <div>Практика урока</div>,
}));
vi.mock("~/shared/lib/media-query", () => ({ useMediaQuery: () => false }));

const render = (ui: React.ReactElement) =>
  baseRender(ui, {
    wrapper: ({ children }) => (
      <LessonProgressProvider>{children}</LessonProgressProvider>
    ),
  });

const lesson = divisorsAndMasksLesson;
const subtopics = lessonSubtopics(lesson);
const bySlug = (slug: string) =>
  subtopics.find((subtopic) => subtopic.slug === slug)!;
const task = (
  id: string,
  hash: string,
  countsTowardMastery?: boolean,
): PracticeTaskTypes.Task =>
  ({
    id,
    solutionRevision: 1,
    theoryLinks: [{ hash, label: "Теория" }],
    countsTowardMastery,
  }) as unknown as PracticeTaskTypes.Task;
const tasks = [
  task("core-1", "delenie-s-ostatkom"),
  task("core-2", "otbor-delitelej"),
  task("advanced-1", "forma-chisla", false),
];

describe("subtopic levels and self-checks (Change 171)", () => {
  it("names the advanced level in the head and the pager, never a core one", () => {
    const { unmount } = render(
      <TopicSubtopicPage
        lesson={lesson}
        subtopic={bySlug("vid-chisla")}
        tasks={tasks}
      />,
    );
    expect(screen.getByText(/Подтема 6 из 6/u).textContent).toBe(
      "Подтема 6 из 6 · дополнительный урок",
    );
    const pager = screen.getByRole("navigation", {
      name: "Соседние страницы темы",
    });
    expect(within(pager).getByText("Дальше →")).toBeTruthy();
    expect(within(pager).getByText("← Назад")).toBeTruthy();
    unmount();

    render(
      <TopicSubtopicPage
        lesson={lesson}
        subtopic={bySlug("maski")}
        tasks={tasks}
      />,
    );
    expect(screen.getByText(/Подтема 5 из 6/u).textContent).toBe(
      "Подтема 5 из 6",
    );
    expect(
      within(
        screen.getByRole("navigation", { name: "Соседние страницы темы" }),
      ).getByText("Дальше → · дополнительный урок"),
    ).toBeTruthy();
  });

  it("puts the subtopic's own self-check before its practice", () => {
    const { container } = render(
      <TopicSubtopicPage
        lesson={lesson}
        subtopic={bySlug("deliteli-parami")}
        tasks={tasks}
      />,
    );
    const practice = container.querySelector("#practice")!;
    const selfCheck = container.querySelector("#self-check")!;
    expect(
      selfCheck.compareDocumentPosition(practice) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      within(selfCheck as HTMLElement).getByRole("region", {
        name: "Проверьте себя",
      }),
    ).toBeTruthy();
    expect(selfCheck.textContent).toContain("числа 49 должна включать 7");
    expect(
      screen.getByRole("navigation", { name: "На этой странице" }).textContent,
    ).toContain("Проверьте себя | Практика");
  });

  it("has no subtopic self-check where none is authored", () => {
    const { container } = render(
      <TopicSubtopicPage
        lesson={lesson}
        subtopic={bySlug("vid-chisla")}
        tasks={tasks}
      />,
    );
    expect(container.querySelector("#self-check")).toBeNull();
  });

  it("leaves advanced tasks out of the progress total for a guest", () => {
    render(
      <LessonProgressPanel
        kind="topic_lesson"
        masteryThreshold={0.8}
        lessonId={lesson.id}
        tasks={tasks}
      />,
    );
    expect(screen.getByText("0 / 2")).toBeTruthy();
  });

  it("keeps the practice page's pager pointing back to the advanced subtopic", () => {
    render(<TopicPracticePage lesson={lesson} tasks={tasks} />);
    expect(screen.getByText("← Назад · дополнительный урок")).toBeTruthy();
  });
});

describe("lesson tree levels", () => {
  it("groups advanced subtopics after core ones under a quiet caption", () => {
    const { container } = render(
      <SubtopicNavigation
        lessonId={lesson.id}
        current="maski"
        tasks={tasks}
        topics={[
          {
            id: lesson.id,
            routeSlug: lesson.routeSlug,
            title: lesson.title,
            number: "25",
            subtopics: subtopics.map(({ slug, title, level }) => ({
              slug,
              title,
              level,
              taskIds: [],
            })),
          },
        ]}
      />,
    );
    const captions = container.querySelectorAll('[aria-hidden="true"]');
    expect(
      [...captions].filter(
        (node) =>
          node.textContent === "Дополнительные уроки · для\u00a0продвинутых",
      ),
    ).toHaveLength(1);
    const advanced = screen.getByRole("link", {
      name: /Вид числа по количеству делителей/u,
    });
    expect(advanced.textContent).toContain(", дополнительный урок");
    expect(
      screen.getByRole("link", { name: /Маски чисел/u }).textContent,
    ).not.toContain("дополнительный");
  });
});
