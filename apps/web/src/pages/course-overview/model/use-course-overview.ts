import { useMemo } from "react";
import {
  useLessonProgressHydrated,
  useLessonsProgress,
} from "~/features/lesson-progress";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import { courseOverviewModel } from "./course-overview-model";

export const useCourseOverview = (props: CourseOverviewPageTypes.Props) => {
  const lessons = useMemo(
    () => props.practiceSummary ?? [],
    [props.practiceSummary],
  );
  const ids = useMemo(() => lessons.map((lesson) => lesson.id), [lessons]);
  const saved = useLessonsProgress(ids, lessons);
  const hydrated = useLessonProgressHydrated();
  return courseOverviewModel.calculate(props, saved, hydrated);
};
