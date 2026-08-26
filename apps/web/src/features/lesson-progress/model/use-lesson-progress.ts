import { useEffect } from "react";
import type { LessonProgressTypes } from "../lesson-progress.types";
import { useLessonProgressRegistry } from "./lesson-progress-context";
import { emptyLessonProgress } from "./lesson-progress-state";

export function useLessonProgress(lessonId: string): LessonProgressTypes.Model {
  const progress = useLessonProgressRegistry(
    (state) => state.lessons[lessonId] ?? emptyLessonProgress,
  );
  const clearLesson = useLessonProgressRegistry((state) => state.clear);
  const ensureLesson = useLessonProgressRegistry((state) => state.ensureLesson);
  const hydrated = useLessonProgressRegistry((state) => state.hydrated);
  const markLessonSolved = useLessonProgressRegistry(
    (state) => state.markSolved,
  );

  useEffect(
    function ensureLessonProgressFx() {
      if (hydrated) ensureLesson(lessonId);
    },
    [ensureLesson, hydrated, lessonId],
  );

  return {
    ...progress,
    clear: () => clearLesson(lessonId),
    markSolved: (taskId, acceptedAnswer) =>
      markLessonSolved(lessonId, taskId, acceptedAnswer),
  };
}
