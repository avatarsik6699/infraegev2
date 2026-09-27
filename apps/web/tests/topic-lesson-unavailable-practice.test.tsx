import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  numberSequencesLesson,
  rekursiyaLesson,
  stringProcessingLesson,
} from "~/entities/lesson";
import type { LessonContent } from "~/entities/lesson";
import { TopicLessonPage } from "~/pages/topic-lesson";
import type { PracticeTaskTypes } from "~/entities/practice-task";

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ invalidate: () => undefined }),
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
  LessonOutline: () => <nav>Оглавление урока</nav>,
}));

vi.mock("~/widgets/lesson-practice-flow", () => ({
  LessonPracticeFlow: () => <div>Практика урока</div>,
}));

vi.mock("~/widgets/public-footer", () => ({
  PublicFooter: () => null,
}));

vi.mock("~/pages/topic-lesson/components/topic-lesson-header", () => ({
  TopicLessonHeader: () => null,
}));

vi.mock("~/pages/topic-lesson/components/topic-lesson-progress", () => ({
  TopicLessonProgress: () => (
    <div data-testid="topic-lesson-progress">Все задания решены (0 / 0)</div>
  ),
}));

vi.mock("~/pages/topic-lesson/components/topic-lesson-result", () => ({
  TopicLessonResult: () => null,
}));

const createTasks = (count: number): PracticeTaskTypes.Task[] =>
  Array.from({ length: count }, (_, index) => ({
    id: "task-" + String(index + 1),
  })) as PracticeTaskTypes.Task[];

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
      render(
        <TopicLessonPage lesson={lesson} tasks={[]} practiceUnavailable />,
      );

      expect(screen.getByText(`Задание ${number}`)).toBeTruthy();
      expect(screen.queryByText(/0 задач/)).toBeNull();
      expect(screen.queryByTestId("topic-lesson-progress")).toBeNull();
      expect(screen.getByText("Практика урока")).toBeTruthy();
    },
  );

  it("shows the task count and progress when eight published tasks are available", () => {
    render(
      <TopicLessonPage
        lesson={numberSequencesLesson}
        tasks={createTasks(8)}
        practiceUnavailable={false}
      />,
    );

    expect(screen.getByText("Задание 17 · 8 задач")).toBeTruthy();
    expect(screen.getByTestId("topic-lesson-progress")).toBeTruthy();
  });

  it("keeps the published lesson count and progress presentation", () => {
    render(
      <TopicLessonPage
        lesson={rekursiyaLesson}
        tasks={createTasks(5)}
        practiceUnavailable={false}
      />,
    );

    expect(screen.getByText("Задание 16 · 5 задач")).toBeTruthy();
    expect(screen.getByTestId("topic-lesson-progress")).toBeTruthy();
  });
});
