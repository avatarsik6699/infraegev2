import { ArrowRight, Circle, CircleCheck } from "lucide-react";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";
import { courseOverviewModel } from "../model/course-overview-model";

type Props = { lesson: CourseOverviewPageTypes.Lesson };

export const CourseOverviewLessonContent: React.FC<Props> = (props) => (
  <span className={styles.lessonRow}>
    <span className={styles.lessonNumber}>{props.lesson.number}</span>
    <span className={styles.lessonTitle}>{props.lesson.title}</span>
    <span className={styles.lessonPractice}>
      {props.lesson.progress.status === "ready" &&
      props.lesson.progress.mastered ? (
        <CircleCheck size={16} aria-hidden="true" />
      ) : (
        <Circle size={16} aria-hidden="true" />
      )}
      <span className={styles.visuallyHidden}>
        {props.lesson.progress.status === "ready" &&
        props.lesson.progress.mastered
          ? "Урок освоен. "
          : ""}
        Практика:{" "}
      </span>
      {!props.lesson.routeSlug
        ? "В плане"
        : courseOverviewModel.practiceCount(props.lesson.progress)}
    </span>
    {props.lesson.routeSlug ? (
      <ArrowRight className={styles.lessonArrow} size={16} aria-hidden="true" />
    ) : null}
  </span>
);
