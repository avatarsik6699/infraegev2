import { Link } from "@tanstack/react-router";
import type { CourseTypes } from "~/entities/course";
import { Typography } from "~/shared/components/typography";
import { CourseLessonProgress } from "./course-lesson-progress";
import styles from "../course-lesson-page.module.css";

type Props = {
  course: CourseTypes.Definition;
  lesson: CourseTypes.LessonDefinition;
  taskCount: number;
};

export const CourseLessonResult: React.FC<Props> = (props) => (
  <div className={styles.resultGrid}>
    <div className={styles.resultSummary}>
      <Typography.Prose>{props.lesson.result}</Typography.Prose>
    </div>
    <CourseLessonProgress
      masteryThreshold={props.lesson.masteryThreshold ?? 0.8}
      lessonId={props.lesson.id}
      taskCount={props.taskCount}
    />
    <nav className={styles.resultNavigation} aria-label="Продолжение курса">
      <Typography.Title order={3}>Что дальше</Typography.Title>
      <Typography.Text tone="muted">
        {props.course.stage === "complete"
          ? "Вернитесь к курсу, чтобы выбрать следующий урок или повторить пройденное."
          : "Вернитесь к курсу, чтобы посмотреть доступные уроки и темы, которые появятся позже."}
      </Typography.Text>
      <Link
        className={styles.courseLink}
        to="/courses/$courseSlug"
        params={{ courseSlug: props.course.routeSlug }}
      >
        {props.course.title}
      </Link>
    </nav>
  </div>
);
