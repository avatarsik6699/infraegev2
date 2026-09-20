import type { CourseProgressTypes } from "./course-progress.types";

const calculatePractice = (
  lessons: readonly CourseProgressTypes.Lesson[],
  progressByLessonId: Readonly<
    Record<string, CourseProgressTypes.LessonProgress>
  >,
): CourseProgressTypes.PracticeSnapshot => {
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
      solved: solvedCount,
      total: lesson.tasks.length,
      mastered:
        lesson.tasks.length > 0 &&
        solvedCount / lesson.tasks.length >= masteryThreshold,
    };
  });
  return {
    byLessonId: Object.fromEntries(
      states.map((state) => [
        state.id,
        {
          solved: state.solved,
          total: state.total,
          mastered: state.mastered,
        },
      ]),
    ),
    solved: states.reduce((sum, state) => sum + state.solved, 0),
    total: states.reduce((sum, state) => sum + state.total, 0),
  };
};

const calculate = (
  lessons: readonly CourseProgressTypes.Lesson[],
  progressByLessonId: Readonly<
    Record<string, CourseProgressTypes.LessonProgress>
  >,
): CourseProgressTypes.Snapshot => {
  const practice = calculatePractice(lessons, progressByLessonId);
  const masteredLessonIds = lessons
    .filter((lesson) => practice.byLessonId[lesson.id]?.mastered)
    .map((lesson) => lesson.id);

  return {
    masteredLessonIds,
    availableCount: lessons.length,
    allAvailableMastered:
      lessons.length > 0 && masteredLessonIds.length === lessons.length,
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
  calculatePractice,
  formatCatalogCopy,
  formatOverviewCopy,
};
