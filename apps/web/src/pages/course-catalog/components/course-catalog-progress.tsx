import { useMemo } from "react";
import { courseProgress, type CourseCatalogTypes } from "~/entities/course";
import {
  useLessonProgressHydrated,
  useLessonsProgress,
} from "~/features/lesson-progress";
import { Badge } from "~/shared/components/badge";

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
    <Badge presentation="metadata" data-course-progress>
      {courseProgress.formatCatalogCopy(progress)}
    </Badge>
  );
};
