import { useMemo } from "react";
import { courseProgress, type CourseCatalogTypes } from "~/entities/course";
import {
  useLessonProgressHydrated,
  useLessonsProgress,
} from "~/features/lesson-progress";
import { Typography } from "~/shared/components/typography";
import styles from "../course-catalog-page.module.css";

type Props = {
  entry: CourseCatalogTypes.PublishedEntry;
};

export const CourseCatalogProgress: React.FC<Props> = (props) => {
  const lessonIds = useMemo(
    () => props.entry.progressLessons.map((lesson) => lesson.id),
    [props.entry.progressLessons],
  );
  const progressByLessonId = useLessonsProgress(lessonIds);
  const hydrated = useLessonProgressHydrated();
  const progress = useMemo(
    () =>
      courseProgress.calculate(props.entry.progressLessons, progressByLessonId),
    [progressByLessonId, props.entry.progressLessons],
  );

  if (!hydrated) return null;

  return (
    <Typography.Text className={styles.progressCopy} data-course-progress>
      {courseProgress.formatCatalogCopy(progress)}
    </Typography.Text>
  );
};
