import type { LessonProgressTypes } from "~/features/lesson-progress";

export type CourseProgressLesson = {
  id: string;
  taskIds: readonly string[];
  masteryThreshold: number;
};

export type CourseProgressSnapshot = {
  masteredLessonIds: readonly string[];
  availableCount: number;
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
    allAvailableMastered:
      states.length > 0 && masteredLessonIds.length === states.length,
  };
}

export function getCourseProgressCopy(
  progress: CourseProgressSnapshot,
): string {
  const count = `${String(progress.masteredLessonIds.length)} из ${String(progress.availableCount)}`;
  if (progress.allAvailableMastered) {
    return `Освоены все доступные уроки: ${count}. Курс продолжает развиваться.`;
  }
  return `Освоено ${count} доступных уроков.`;
}
