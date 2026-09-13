import { useMemo } from "react";
import { courseProgress, type CourseProgressTypes } from "~/entities/course";
import {
  useLessonProgressHydrated,
  useLessonsProgress,
} from "~/features/lesson-progress";
import { Progress } from "~/shared/components/progress";
import { Typography } from "~/shared/components/typography";
import styles from "../course-overview-page.module.css";

type Props = {
  lessons: readonly CourseProgressTypes.Lesson[] | null;
};

export const CourseOverviewProgress: React.FC<Props> = (props) => {
  const progressLessons = useMemo(() => props.lessons ?? [], [props.lessons]);
  const lessonIds = useMemo(
    () => progressLessons.map((lesson) => lesson.id),
    [progressLessons],
  );
  const progressByLessonId = useLessonsProgress(lessonIds, progressLessons);
  const hydrated = useLessonProgressHydrated();
  const progress = useMemo(
    () => courseProgress.calculate(progressLessons, progressByLessonId),
    [progressByLessonId, progressLessons],
  );
  if (!props.lessons)
    return (
      <Typography.Text role="status" tone="muted">
        Прогресс временно недоступен. Обновите страницу, чтобы повторить
        загрузку.
      </Typography.Text>
    );
  if (progress.availableCount === 0) return null;

  const copy = courseProgress.formatOverviewCopy(progress);

  return (
    <section
      className={styles.progress}
      aria-label="Прогресс курса"
      data-progress-ready={hydrated || undefined}
    >
      <Typography.Text tone="muted">
        {hydrated ? copy : "Прогресс на этом устройстве"}
      </Typography.Text>
      <Progress
        className={hydrated ? undefined : styles.progressPending}
        label="Освоенные доступные уроки"
        max={progress.availableCount}
        value={progress.masteredLessonIds.length}
        valueText={copy}
      />
    </section>
  );
};
