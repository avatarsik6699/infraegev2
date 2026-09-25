import { useMemo } from "react";
import {
  useLessonProgressHydrated,
  useLessonProgressStatus,
  useLessonsProgress,
} from "~/features/lesson-progress";
import { useAccountSession } from "~/features/account";
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
  const progressStatus = useLessonProgressStatus();
  const session = useAccountSession();
  return courseOverviewModel.calculate(
    props,
    saved,
    hydrated,
    progressStatus === "error" || session.status === "error",
    session.status === "ready" && !session.account,
  );
};
