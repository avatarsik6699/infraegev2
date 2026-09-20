import { useMemo } from "react";
import { courseCatalog } from "~/entities/course";
import {
  useLessonProgressHydrated,
  useLessonsProgress,
} from "~/features/lesson-progress";
import type { CourseCatalogPageTypes } from "../course-catalog-page.types";
import { courseCatalogModel } from "./course-catalog-model";

export const useCourseCatalog = (
  summaries: CourseCatalogPageTypes.Props["summaries"],
) => {
  const lessons = useMemo(
    () =>
      courseCatalog.entries.flatMap((entry) =>
        entry.status === "published" ? (summaries[entry.id] ?? []) : [],
      ),
    [summaries],
  );
  const lessonIds = useMemo(
    () => lessons.map((lesson) => lesson.id),
    [lessons],
  );
  const progressByLessonId = useLessonsProgress(lessonIds, lessons);
  const hydrated = useLessonProgressHydrated();
  return courseCatalogModel.calculate(
    courseCatalog.entries,
    summaries,
    progressByLessonId,
    hydrated,
  );
};
