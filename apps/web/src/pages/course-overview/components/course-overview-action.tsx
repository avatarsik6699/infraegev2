import { ActionLink } from "~/shared/components/action-link";
import type { CourseTypes } from "~/entities/course";
import styles from "../course-overview-page.module.css";

type Props = {
  course: CourseTypes.Definition;
  firstVisibleLesson?: CourseTypes.LessonDefinition;
};

export const CourseOverviewAction: React.FC<Props> = (props) => {
  if (!props.firstVisibleLesson) return null;
  return (
    <ActionLink
      hierarchy="drawn"
      icon="forward"
      className={styles.courseLink}
      to="/courses/$courseSlug/$lessonSlug"
      params={{
        courseSlug: props.course.routeSlug,
        lessonSlug: props.firstVisibleLesson.routeSlug,
      }}
    >
      Открыть первый урок для проверки
    </ActionLink>
  );
};
