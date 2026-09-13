import type { CourseProgressTypes } from "./course-progress.types";

const calculate = (
  lessons: readonly CourseProgressTypes.Lesson[],
  progressByLessonId: Readonly<
    Record<string, CourseProgressTypes.LessonProgress>
  >,
): CourseProgressTypes.Snapshot => {
  const states = lessons.map((lesson) => {
    const solvedIds = new Set(
      progressByLessonId[lesson.id]?.solvedTaskIds ?? [],
    );
    const solvedCount = lesson.tasks.filter((task) =>
      solvedIds.has(task.id),
    ).length;
    const masteryThreshold = lesson.masteryThreshold ?? 0.8;

    return {
      id: lesson.id,
      mastered:
        lesson.tasks.length > 0 &&
        solvedCount / lesson.tasks.length >= masteryThreshold,
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
};

const formatOverviewCopy = (progress: CourseProgressTypes.Snapshot): string => {
  const count = `${String(progress.masteredLessonIds.length)} из ${String(progress.availableCount)}`;
  if (progress.allAvailableMastered) {
    return `Освоены все доступные уроки: ${count}. Курс продолжает развиваться.`;
  }
  return `Освоено ${count} доступных уроков.`;
};

const formatCatalogCopy = (progress: CourseProgressTypes.Snapshot): string =>
  `Освоено ${String(progress.masteredLessonIds.length)} из ${String(progress.availableCount)} уроков`;

export const courseProgress = {
  calculate,
  formatCatalogCopy,
  formatOverviewCopy,
};
