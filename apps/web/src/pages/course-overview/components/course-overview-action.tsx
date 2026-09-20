import { ActionLink } from "~/shared/components/action-link";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";

type Props = {
  courseRouteSlug: string;
  action?: CourseOverviewPageTypes.Action;
  modules: readonly CourseOverviewPageTypes.Module[];
};

export const CourseOverviewAction: React.FC<Props> = (props) => {
  if (!props.action) return null;
  return (
    <ActionLink
      presentation="button"
      hierarchy="primary"
      icon="forward"
      className={styles.courseLink}
      to="/courses/$courseSlug/$lessonSlug"
      params={{
        courseSlug: props.courseRouteSlug,
        lessonSlug: props.action.lesson.routeSlug,
      }}
    >
      <span className={styles.actionCopy}>
        <span>{props.action.label}</span>
        {props.modules.flatMap((module) =>
          module.lessons
            .filter((lesson) => lesson.routeSlug)
            .map((lesson) => (
              <span
                key={lesson.id}
                className={styles.actionMeasure}
                aria-hidden="true"
              >
                Продолжить: {lesson.title}
              </span>
            )),
        )}
      </span>
    </ActionLink>
  );
};
