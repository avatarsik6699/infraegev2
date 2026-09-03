import type { CourseTypes } from "~/entities/course";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import styles from "../course-lesson-page.module.css";

type Props = {
  course: CourseTypes.Definition;
  lesson: CourseTypes.LessonDefinition;
  previousLesson?: CourseTypes.LessonDefinition;
  nextLesson?: CourseTypes.LessonDefinition;
};

export const CourseLessonResult: React.FC<Props> = (props) => (
  <div className={styles.resultGrid}>
    <div className={styles.resultSummary}>
      <Typography.Prose>{props.lesson.result}</Typography.Prose>
    </div>
    <nav className={styles.resultNavigation} aria-label="Продолжение курса">
      <div className={styles.resultLinks}>
        {props.previousLesson ? (
          <ActionLink
            hierarchy="text"
            icon="back"
            to={`/courses/${props.course.routeSlug}/${props.previousLesson.routeSlug}`}
          >
            {`Предыдущий урок: ${props.previousLesson.title}`}
          </ActionLink>
        ) : null}
        {props.nextLesson ? (
          <ActionLink
            hierarchy="text"
            icon="forward"
            to={`/courses/${props.course.routeSlug}/${props.nextLesson.routeSlug}`}
          >
            {props.nextLesson.title}
          </ActionLink>
        ) : null}
      </div>
    </nav>
  </div>
);
