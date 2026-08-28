import { Link } from "@tanstack/react-router";
import type { CourseTypes } from "~/entities/course";
import { Typography } from "~/shared/components/typography";
import styles from "../course-overview-page.module.css";

type Props = {
  courseRouteSlug: string;
  index: number;
  lessons: readonly CourseTypes.LessonDefinition[];
  module: CourseTypes.Module;
};

export const CourseOverviewModule: React.FC<Props> = (props) => {
  const lessonsById = new Map(
    props.lessons.map((lesson) => [lesson.id, lesson] as const),
  );
  const available = props.module.lessonPlan.some(
    (planItem) => lessonsById.get(planItem.id)?.status === "published",
  );

  return (
    <li
      className={styles.module}
      data-availability={available ? "available" : "planned"}
      data-course-module
    >
      <span className={styles.moduleNumber} aria-hidden="true">
        {String(props.index + 1).padStart(2, "0")}
      </span>
      <div className={styles.moduleCopy}>
        <Typography.Title order={3}>{props.module.title}</Typography.Title>
        <Typography.Text tone="muted">{props.module.summary}</Typography.Text>
      </div>
      <ol className={styles.lessonList}>
        {props.module.lessonPlan.map((planItem) => {
          const lesson = lessonsById.get(planItem.id);
          const published = lesson?.status === "published";
          return (
            <li
              className={styles.lessonPlanItem}
              data-course-lesson-plan-item
              data-lesson-status={published ? "published" : "planned"}
              key={planItem.id}
            >
              {published ? (
                <Link
                  className={styles.lessonRow}
                  to="/courses/$courseSlug/$lessonSlug"
                  params={{
                    courseSlug: props.courseRouteSlug,
                    lessonSlug: lesson.routeSlug,
                  }}
                >
                  <span className={styles.lessonCopy}>
                    <span
                      className={styles.lessonTitle}
                      data-course-lesson-title
                    >
                      {planItem.title}
                    </span>
                    <span
                      className={styles.lessonOutcome}
                      data-course-lesson-outcome
                    >
                      {planItem.outcome}
                    </span>
                  </span>
                </Link>
              ) : (
                <div className={styles.lessonRow}>
                  <span className={styles.lessonCopy}>
                    <span
                      className={styles.lessonTitle}
                      data-course-lesson-title
                    >
                      {planItem.title}
                    </span>
                    <span
                      className={styles.lessonOutcome}
                      data-course-lesson-outcome
                    >
                      {planItem.outcome}
                    </span>
                  </span>
                  <span className={styles.lessonStatus}>В плане</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </li>
  );
};
