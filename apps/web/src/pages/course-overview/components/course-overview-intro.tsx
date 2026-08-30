import { Link } from "@tanstack/react-router";
import type { CourseTypes } from "~/entities/course";
import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import styles from "../course-overview-page.module.css";

type Props = {
  course: CourseTypes.Definition;
  firstVisibleLesson?: CourseTypes.LessonDefinition;
};

export const CourseOverviewIntro: React.FC<Props> = (props) => (
  <header className={styles.intro}>
    <div className={styles.meta}>
      <Badge>Мини-курс</Badge>
      <Badge>Python 3</Badge>
      <Badge>
        {props.course.stage === "early_access"
          ? "Ранний доступ"
          : "Полный курс"}
      </Badge>
    </div>
    <Typography.Title order={1}>{props.course.title}</Typography.Title>
    <Typography.Text variant="lead" tone="muted">
      {props.course.summary}
    </Typography.Text>
    <Typography.Text className={styles.introSummary}>
      {props.course.audience}
    </Typography.Text>
    <CourseOverviewAction {...props} />
  </header>
);

const CourseOverviewAction: React.FC<Props> = (props) => {
  if (!props.firstVisibleLesson) return null;
  return (
    <Link
      className={styles.courseLink}
      to="/courses/$courseSlug/$lessonSlug"
      params={{
        courseSlug: props.course.routeSlug,
        lessonSlug: props.firstVisibleLesson.routeSlug,
      }}
    >
      Открыть первый урок для проверки
    </Link>
  );
};
