import { CourseOverviewAction } from "./course-overview-action";
import type { CourseTypes } from "~/entities/course";
import { Typography } from "~/shared/components/typography";
import styles from "../course-overview-page.module.css";

type Props = {
  course: CourseTypes.Definition;
  publishedLessonCount: number;
  firstVisibleLesson?: CourseTypes.LessonDefinition;
};

export const CourseOverviewIntro: React.FC<Props> = (props) => (
  <header className={styles.intro}>
    <Typography.Title order={1}>{props.course.title}</Typography.Title>
    <Typography.Text variant="lead" tone="muted">
      {props.course.summary}
    </Typography.Text>
    <Typography.Text className={styles.introSummary}>
      {props.course.audience}
    </Typography.Text>
    <Typography.Text className={styles.meta} tone="muted">
      Мини-курс ·{" "}
      {props.course.stage === "early_access" ? "Ранний доступ" : "Полный курс"}{" "}
      · Доступно уроков: {props.publishedLessonCount}
    </Typography.Text>
    <CourseOverviewAction {...props} />
  </header>
);
