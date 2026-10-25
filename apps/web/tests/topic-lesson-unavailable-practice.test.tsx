import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { lessonSubtopics, type LessonContent } from "~/entities/lesson";
import { numberSequencesLesson } from "~/entities/lesson/content/number-sequences.lesson";
import { rekursiyaLesson } from "~/entities/lesson/content/rekursiya.lesson";
import { stringProcessingLesson } from "~/entities/lesson/content/string-processing.lesson";
import { TopicPracticePage, TopicSubtopicPage } from "~/pages/topic-lesson";
import type { PracticeTaskTypes } from "~/entities/practice-task";

vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  useRouter: () => ({ invalidate: () => undefined }),
  // The practice page renders the lesson summary, which links to theory.
  Link: (props: { children?: React.ReactNode; to?: string }) => (
    <a href={props.to}>{props.children}</a>
  ),
}));

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: (props: { children?: React.ReactNode; to: string }) => (
    <a href={props.to}>{props.children}</a>
  ),
}));

vi.mock("~/shared/components/scroll-to-top", () => ({
  ScrollToTop: () => null,
}));

vi.mock("~/features/reading-position", () => ({
  ReadingPositionIndicator: () => null,
}));

vi.mock("~/features/account", () => ({
  useAccountSession: () => ({
    status: "ready",
    account: null,
    csrfToken: "",
  }),
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
  ) => {
    const actual = await importOriginal();
    return {
      ...actual,
      LessonTheory: () => <div>Теория урока</div>,
      LessonSectionHeading: ({ children }: { children: React.ReactNode }) => (
        <h2>{children}</h2>
      ),
    };
  },
);

vi.mock("~/widgets/lesson-outline", () => ({
  PageOutline: () => <nav>На этой странице</nav>,
}));

vi.mock("~/widgets/subtopic-navigation", () => ({
  SubtopicNavigation: (props: { progress?: React.ReactNode }) => (
    <nav>{props.progress}</nav>
  ),
}));

// A wide screen: lesson progress renders under «На этой странице» (F38).
vi.mock("~/shared/lib/media-query", () => ({
  useMediaQuery: () => false,
}));

vi.mock("~/widgets/public-header", () => ({
  PublicHeader: () => null,
}));

vi.mock("~/shared/components/breadcrumbs", () => ({
  Breadcrumbs: () => null,
}));

vi.mock("~/pages/topic-lesson/components/topic-lesson-pager", () => ({
  TopicLessonPager: () => null,
}));

vi.mock("~/pages/topic-lesson/components/legacy-section-redirect", () => ({
  LegacySectionRedirect: () => null,
}));

vi.mock("~/widgets/lesson-practice-flow", () => ({
  LessonPracticeFlow: () => <div>Практика урока</div>,
}));

vi.mock("~/widgets/public-footer", () => ({
  PublicFooter: () => null,
}));

vi.mock("~/widgets/lesson-progress-panel", () => ({
  LessonProgressPanel: () => (
    <div data-testid="topic-lesson-progress">Все задания решены (0 / 0)</div>
  ),
}));

const createTasks = (count: number): PracticeTaskTypes.Task[] =>
  Array.from({ length: count }, (_, index) => ({
    id: "task-" + String(index + 1),
    theoryLinks: [],
  })) as unknown as PracticeTaskTypes.Task[];

const firstSubtopic = (lesson: LessonContent.Definition) =>
  lessonSubtopics(lesson)[0];

describe("topic lesson with unavailable practice", () => {
  it.each([
    { lesson: numberSequencesLesson, number: 17 },
    { lesson: stringProcessingLesson, number: 24 },
  ])(
    "keeps topic $number readable when practice is unavailable",
    ({
      lesson,
      number,
    }: {
      lesson: LessonContent.Definition;
      number: number;
    }) => {
      const { unmount } = render(
        <TopicSubtopicPage
          lesson={lesson}
          subtopic={firstSubtopic(lesson)}
          tasks={[]}
          practiceUnavailable
        />,
      );

      expect(screen.getByText(`Задание ${number}`)).toBeTruthy();
      expect(screen.queryByText(/0 задач/)).toBeNull();
      expect(screen.queryByTestId("topic-lesson-progress")).toBeNull();
      unmount();

      render(
        <TopicPracticePage lesson={lesson} tasks={[]} practiceUnavailable />,
      );
      expect(screen.getByText("Практика урока")).toBeTruthy();
    },
  );

  it("shows the task count and progress when eight published tasks are available", () => {
    render(
      <TopicSubtopicPage
        lesson={numberSequencesLesson}
        subtopic={firstSubtopic(numberSequencesLesson)}
        tasks={createTasks(8)}
        practiceUnavailable={false}
      />,
    );

    // the topic head (F6): the task as a kicker, then «N подтем · M задач»
    expect(screen.getByText("Задание 17")).toBeTruthy();
    expect(
      screen.getByText(/^\d+ подтем\S* · 8 задач · повышенный · ≈ \d+ мин$/u),
    ).toBeTruthy();
    expect(screen.getByTestId("topic-lesson-progress")).toBeTruthy();
  });

  it("keeps the published lesson count and progress presentation", () => {
    render(
      <TopicSubtopicPage
        lesson={rekursiyaLesson}
        subtopic={firstSubtopic(rekursiyaLesson)}
        tasks={createTasks(5)}
        practiceUnavailable={false}
      />,
    );

    // the topic head (F6): the task as a kicker, then «N подтем · M задач»
    expect(screen.getByText("Задание 16")).toBeTruthy();
    expect(
      screen.getByText(/^\d+ подтем\S* · 5 задач · повышенный · ≈ \d+ мин$/u),
    ).toBeTruthy();
    expect(screen.getByTestId("topic-lesson-progress")).toBeTruthy();
  });
});
