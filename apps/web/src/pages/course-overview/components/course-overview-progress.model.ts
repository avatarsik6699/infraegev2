import type { LessonProgressTypes } from "~/features/lesson-progress";

export type CourseProgressLesson = {
  id: string;
  taskIds: readonly string[];
  masteryThreshold: number;
};

export type CourseProgressSnapshot = {
  masteredLessonIds: readonly string[];
  availableCount: number;
  continueLessonId: string | null;
  allAvailableMastered: boolean;
};

export function calculateCourseProgress(
  lessons: readonly CourseProgressLesson[],
  progressByLessonId: Readonly<Record<string, LessonProgressTypes.Snapshot>>,
): CourseProgressSnapshot {
  const states = lessons.map((lesson) => {
    const solvedIds = new Set(
      progressByLessonId[lesson.id]?.solvedTaskIds ?? [],
    );
    const solvedCount = lesson.taskIds.filter((taskId) =>
      solvedIds.has(taskId),
    ).length;
    return {
      id: lesson.id,
      mastered:
        lesson.taskIds.length > 0 &&
        solvedCount / lesson.taskIds.length >= lesson.masteryThreshold,
    };
  });
  const masteredLessonIds = states
    .filter((state) => state.mastered)
    .map((state) => state.id);
  return {
    masteredLessonIds,
    availableCount: states.length,
    continueLessonId:
      states.find((state) => !state.mastered)?.id ?? states.at(-1)?.id ?? null,
    allAvailableMastered:
      states.length > 0 && masteredLessonIds.length === states.length,
  };
}

type Presentation = {
  action: string;
  copy: string;
};

export function getCourseProgressPresentation(
  progress: CourseProgressSnapshot,
): Presentation {
  const count = `${String(progress.masteredLessonIds.length)} из ${String(progress.availableCount)}`;
  if (progress.allAvailableMastered) {
    return {
      action: "Повторить последний доступный урок",
      copy: `Освоены все доступные уроки: ${count}. Курс продолжает развиваться.`,
    };
  }
  if (progress.masteredLessonIds.length > 0) {
    return {
      action: "Продолжить курс",
      copy: `Освоено ${count} доступных уроков.`,
    };
  }
  return {
    action: "Начать курс",
    copy: `Освоено ${count} доступных уроков.`,
  };
}
