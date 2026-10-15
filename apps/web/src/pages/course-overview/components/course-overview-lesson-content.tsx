import { Check, ChevronRight } from "lucide-react";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";
import { courseOverviewModel } from "../model/course-overview-model";
import { advancedLevelLabel } from "~/entities/lesson";

type Props = {
  lesson: CourseOverviewPageTypes.Lesson;
  markAdvanced: boolean;
};

/** F26: a mastered lesson gets a plain green check before its title, others nothing. */
export const CourseOverviewLessonContent: React.FC<Props> = (props) => {
  const mastered =
    props.lesson.progress.status === "ready" && props.lesson.progress.mastered;
  return (
    <span className={styles.lessonRow}>
      <span className={styles.lessonNumber}>{props.lesson.number}</span>
      <span className={styles.lessonCheck}>
        {mastered ? (
          <Check size={16} strokeWidth={2.5} aria-hidden="true" />
        ) : null}
      </span>
      <span className={styles.lessonTitle}>
        {props.lesson.title}
        {props.markAdvanced && props.lesson.advanced ? (
          <span className={styles.lessonLevel}> · {advancedLevelLabel}</span>
        ) : null}
      </span>
      {props.lesson.routeSlug && !props.lesson.hasPractice ? (
        <span className={styles.lessonPractice} />
      ) : (
        <span className={styles.lessonPractice}>
          {mastered ? (
            <span className={styles.visuallyHidden}>Урок освоен. </span>
          ) : null}
          {props.lesson.routeSlug
            ? `Практика: ${courseOverviewModel.practiceCount(props.lesson.progress)}`
            : "В плане"}
        </span>
      )}
      {props.lesson.routeSlug ? (
        <ChevronRight
          className={styles.lessonArrow}
          size={18}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
};
