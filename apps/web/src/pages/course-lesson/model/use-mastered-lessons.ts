import { useMemo } from "react";
import {
  courseProgress,
  type CourseProgressTypes,
  type CourseTypes,
} from "~/entities/course";
import { useAccountSession } from "~/features/account";
import { useLessonsProgress } from "~/features/lesson-progress";

const none: ReadonlySet<string> = new Set();

/**
 * Change 186 (F26): the course's mastered lessons for the green checks in the
 * lesson rail — the overview's rule, from the course practice summary. A
 * guest or a missing summary marks nothing.
 */
export const useMasteredLessons = (
  lessons: readonly CourseTypes.LessonOutline[],
  summary: readonly CourseProgressTypes.Lesson[] | null | undefined,
): ReadonlySet<string> => {
  const session = useAccountSession();
  const versions = useMemo(() => summary ?? [], [summary]);
  const ids = useMemo(() => versions.map((lesson) => lesson.id), [versions]);
  const saved = useLessonsProgress(ids, versions);
  if (!session.account || versions.length === 0) return none;
  const thresholds = new Map(
    lessons.map((lesson) => [lesson.id, lesson.masteryThreshold]),
  );
  const practice = courseProgress.calculatePractice(
    versions.map((lesson) => ({
      ...lesson,
      masteryThreshold: thresholds.get(lesson.id),
    })),
    saved,
  );
  return new Set(
    Object.entries(practice.byLessonId)
      .filter(([, state]) => state.mastered)
      .map(([id]) => id),
  );
};
