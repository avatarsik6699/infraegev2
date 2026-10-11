import type { CourseProgressTypes } from "./course-progress.types";

/** Lessons that count toward course mastery: additional ones do not (SPEC §1.4). */
const coreLessons = <Lesson extends { level?: "core" | "advanced" }>(
  lessons: readonly Lesson[],
): Lesson[] => lessons.filter((lesson) => lesson.level !== "advanced");

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
  const core = new Set(coreLessons(lessons).map((lesson) => lesson.id));
  const counted = states.filter((state) => core.has(state.id));
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
    solved: counted.reduce((sum, state) => sum + state.solved, 0),
    total: counted.reduce((sum, state) => sum + state.total, 0),
  };
};

const calculate = (
  lessons: readonly CourseProgressTypes.Lesson[],
  progressByLessonId: Readonly<
    Record<string, CourseProgressTypes.LessonProgress>
  >,
): CourseProgressTypes.Snapshot => {
  const practice = calculatePractice(lessons, progressByLessonId);
  const core = coreLessons(lessons);
  const masteredLessonIds = core
    .filter((lesson) => practice.byLessonId[lesson.id]?.mastered)
    .map((lesson) => lesson.id);

  return {
    masteredLessonIds,
    availableCount: core.length,
    allAvailableMastered:
      core.length > 0 && masteredLessonIds.length === core.length,
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
  coreLessons,
  calculatePractice,
  formatCatalogCopy,
  formatOverviewCopy,
};
