import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { PublicHeader } from "~/widgets/public-header";
import styles from "../course-lesson-page.module.css";

type Props = {
  courseRouteSlug: string;
  courseTitle: string;
  lessonTitle: string;
};

export const CourseLessonHeader: React.FC<Props> = (props) => (
  <>
    <PublicHeader activeSection="courses" />
    <nav
      className={styles.contextBar}
      data-course-lesson-context
      aria-label="Навигация урока"
    >
      <div className={styles.contextArea}>
        <ActionLink
          hierarchy="drawn"
          icon="back"
          to="/courses/$courseSlug"
          params={{ courseSlug: props.courseRouteSlug }}
        >
          К курсу
        </ActionLink>
      </div>
      <Typography.Text className={styles.contextLesson}>
        {props.courseTitle + " · " + props.lessonTitle}
      </Typography.Text>
    </nav>
  </>
);
