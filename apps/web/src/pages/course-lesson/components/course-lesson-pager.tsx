import { Link } from "@tanstack/react-router";
import type { CourseTypes } from "~/entities/course";
import styles from "../course-lesson.module.css";

type Props = {
  courseRouteSlug: string;
  previous?: CourseTypes.LessonOutline;
  next?: CourseTypes.LessonOutline;
};

const PagerLink: React.FC<{
  courseRouteSlug: string;
  lesson: CourseTypes.LessonOutline;
  direction: "previous" | "next";
}> = (props) => (
  <Link
    className={styles.pagerLink}
    title={props.lesson.title}
    data-direction={props.direction}
    rel={props.direction === "previous" ? "prev" : "next"}
    to="/courses/$courseSlug/$lessonSlug"
    params={{
      courseSlug: props.courseRouteSlug,
      lessonSlug: props.lesson.routeSlug,
    }}
  >
    <span className={styles.pagerLabel}>
      {props.direction === "previous" ? "← Предыдущий урок" : "Дальше →"}
    </span>
    <span className={styles.pagerTitle}>{props.lesson.title}</span>
  </Link>
);

export const CourseLessonPager: React.FC<Props> = (props) =>
  props.previous || props.next ? (
    <nav
      className={styles.pager}
      aria-label="Соседние уроки курса"
      data-course-lesson-pager
    >
      {props.previous ? (
        <PagerLink
          courseRouteSlug={props.courseRouteSlug}
          lesson={props.previous}
          direction="previous"
        />
      ) : (
        <span />
      )}
      {props.next ? (
        <PagerLink
          courseRouteSlug={props.courseRouteSlug}
          lesson={props.next}
          direction="next"
        />
      ) : null}
    </nav>
  ) : null;
