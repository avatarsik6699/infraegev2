import { ActionLink } from "~/shared/components/action-link";
import { CourseOverviewLessonContent } from "./course-overview-lesson-content";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";

type Props = {
  courseRouteSlug: string;
  lesson: CourseOverviewPageTypes.Lesson;
  continuing: boolean;
};

export const CourseOverviewLesson: React.FC<Props> = (props) => (
  <li
    className={styles.lessonItem}
    data-course-lesson-plan-item
    data-lesson-status={props.lesson.routeSlug ? "published" : "planned"}
  >
    {props.lesson.routeSlug ? (
      <ActionLink
        presentation="navigation"
        hierarchy="text"
        icon="none"
        className={styles.lessonLink}
        data-continuing={props.continuing || undefined}
        data-course-lesson-title
        to="/courses/$courseSlug/$lessonSlug"
        params={{
          courseSlug: props.courseRouteSlug,
          lessonSlug: props.lesson.routeSlug,
        }}
      >
        <CourseOverviewLessonContent lesson={props.lesson} />
      </ActionLink>
    ) : (
      <div className={styles.plannedLesson}>
        <CourseOverviewLessonContent lesson={props.lesson} />
      </div>
    )}
  </li>
);
