import { useMemo } from "react";
import type { CourseTypes } from "~/entities/course";
import { useLessonsProgress } from "~/features/lesson-progress";
import { Progress } from "~/shared/components/progress";
import { Typography } from "~/shared/components/typography";
import styles from "../course-overview-page.module.css";
import {
  calculateCourseProgress,
  getCourseProgressCopy,
} from "./course-overview-progress.model";

type Props = {
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
  if (progress.availableCount === 0) return null;

  const copy = getCourseProgressCopy(progress);

  return (
    <section className={styles.progress} aria-label="Прогресс курса">
      <Typography.Text tone="muted">{copy}</Typography.Text>
      <Progress
        className={styles.progressBar}
        label="Освоенные доступные уроки"
        max={progress.availableCount}
        value={progress.masteredLessonIds.length}
        valueText={copy}
      />
    </section>
  );
};
