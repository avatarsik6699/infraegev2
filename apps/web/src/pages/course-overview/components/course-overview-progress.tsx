import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import type { CourseTypes } from "~/entities/course";
import { useLessonsProgress } from "~/features/lesson-progress";
import { Typography } from "~/shared/components/typography";
import styles from "../course-overview-page.module.css";
import {
  calculateCourseProgress,
  getCourseProgressPresentation,
} from "./course-overview-progress.model";

type Props = {
  courseRouteSlug: string;
  lessons: readonly CourseTypes.LessonDefinition[];
};

export const CourseOverviewProgress: React.FC<Props> = (props) => {
  const progressLessons = useMemo(
    () =>
      props.lessons.map((lesson) => ({
        id: lesson.id,
        taskIds: lesson.practiceTaskIds,
        masteryThreshold: lesson.masteryThreshold ?? 0.8,
      })),
    [props.lessons],
  );
  const lessonIds = useMemo(
    () => progressLessons.map((lesson) => lesson.id),
    [progressLessons],
  );
  const progressByLessonId = useLessonsProgress(lessonIds);
  const progress = useMemo(
    () => calculateCourseProgress(progressLessons, progressByLessonId),
    [progressByLessonId, progressLessons],
  );
  const destination =
    props.lessons.find((lesson) => lesson.id === progress.continueLessonId) ??
    props.lessons[0];

  if (!destination) return null;

  const presentation = getCourseProgressPresentation(progress);

  return (
    <section
      className={styles.progress}
      aria-labelledby="course-progress-title"
    >
      <Typography.Title order={2} id="course-progress-title">
        Ваш прогресс
      </Typography.Title>
      <Typography.Text tone="muted">{presentation.copy}</Typography.Text>
      <Link
        className={styles.courseLink}
        to="/courses/$courseSlug/$lessonSlug"
        params={{
          courseSlug: props.courseRouteSlug,
          lessonSlug: destination.routeSlug,
        }}
      >
        {presentation.action}
      </Link>
    </section>
  );
};
