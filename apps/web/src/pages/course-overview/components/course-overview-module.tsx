import { SurfaceGlint } from "~/shared/components/surface-decoration";
import { useRef } from "react";
import { useElementActivity } from "~/shared/lib/element-activity";
import { ActionLink } from "~/shared/components/action-link";
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
  const moduleRef = useRef<HTMLLIElement>(null);
  const active = useElementActivity(moduleRef);
  const lessonsById = new Map(
    props.lessons.map((lesson) => [lesson.id, lesson] as const),
  );
  const available = props.module.lessonPlan.some(
    (planItem) => lessonsById.get(planItem.id)?.status === "published",
  );

  return (
    <li
      ref={moduleRef}
      data-motion-active={active || undefined}
      className={styles.module}
      data-availability={available ? "available" : "planned"}
      data-course-module
    >
      <span className={styles.moduleNumber} aria-hidden="true">
        {String(props.index + 1).padStart(2, "0")}
        <SurfaceGlint
          kind="soft"
          active={active}
          playback="loop"
          className={styles.numberSheen}
        />
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
                <div className={styles.lessonRow}>
                  <div className={styles.lessonCopy}>
                    <ActionLink
                      hierarchy="drawn"
                      className={styles.lessonTitle}
                      data-course-lesson-title
                      data-title-status="published"
                      to="/courses/$courseSlug/$lessonSlug"
                      params={{
                        courseSlug: props.courseRouteSlug,
                        lessonSlug: lesson.routeSlug,
                      }}
                    >
                      {planItem.title}
                    </ActionLink>
                    <span
                      className={styles.lessonOutcome}
                      data-course-lesson-outcome
                    >
                      {planItem.outcome}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.lessonRow}>
                  <span className={styles.lessonCopy}>
                    <span
                      className={styles.lessonTitle}
                      data-course-lesson-title
                      data-title-status="planned"
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
