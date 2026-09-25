import { currentLessonProgress } from "./lesson-progress-state";
import { useEffect } from "react";
import type { LessonProgressTypes } from "../lesson-progress.types";
import { useLessonProgressRegistry } from "./lesson-progress-context";

export function useLessonsProgress(
  lessonIds: readonly string[],
  versions?: readonly {
    id: string;
    tasks: readonly { id: string; solutionRevision?: number }[];
  }[],
): Readonly<Record<string, LessonProgressTypes.Snapshot>> {
  const lessons = useLessonProgressRegistry((state) => state.lessons);
  const ensureLesson = useLessonProgressRegistry((state) => state.ensureLesson);
  const hydrated = useLessonProgressRegistry((state) => state.hydrated);

  useEffect(
    function ensureLessonsProgressFx() {
      if (!hydrated) return;
      for (const lessonId of lessonIds) ensureLesson(lessonId);
    },
    [ensureLesson, hydrated, lessonIds],
  );

  return versions
    ? Object.fromEntries(
        versions.map((lesson) => [
          lesson.id,
          currentLessonProgress(
            lessons[lesson.id] ?? { solvedTaskIds: [] },
            lesson.tasks,
          ),
        ]),
      )
    : lessons;
}
