import { useMemo } from "react";
import { courseProgress, type CourseProgressTypes } from "~/entities/course";
import {
  useLessonProgressHydrated,
  useLessonsProgress,
} from "~/features/lesson-progress";
import { Badge } from "~/shared/components/badge";

type Props = {
  lessons: readonly CourseProgressTypes.Lesson[] | null;
};

export const CourseCatalogProgress: React.FC<Props> = (props) => {
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
    return <Badge presentation="metadata">Прогресс временно недоступен</Badge>;
  if (!hydrated) return null;

  return (
    <Badge presentation="metadata" data-course-progress>
      {courseProgress.formatCatalogCopy(progress)}
    </Badge>
  );
};
