import { Link } from "@tanstack/react-router";
import styles from "../topic-lesson.module.css";

type Target = {
  title: string;
  /** Subtopic slug; omitted for the final practice page. */
  subtopic?: string;
};

type Props = {
  routeSlug: string;
  previous?: Target;
  next?: Target;
};

const PagerLink: React.FC<{
  routeSlug: string;
  target: Target;
  direction: "previous" | "next";
}> = (props) => {
  const content = (
    <>
      <span className={styles.pagerLabel}>
        {props.direction === "previous" ? "← Назад" : "Дальше →"}
      </span>
      <span className={styles.pagerTitle}>{props.target.title}</span>
    </>
  );
  return props.target.subtopic ? (
    <Link
      className={styles.pagerLink}
      data-direction={props.direction}
      rel={props.direction === "previous" ? "prev" : "next"}
      to="/ege/$slug/$subtopic"
      params={{ slug: props.routeSlug, subtopic: props.target.subtopic }}
    >
      {content}
    </Link>
  ) : (
    <Link
      className={styles.pagerLink}
      data-direction={props.direction}
      rel={props.direction === "previous" ? "prev" : "next"}
      to="/ege/$slug/praktika"
      params={{ slug: props.routeSlug }}
    >
      {content}
    </Link>
  );
};

export const TopicLessonPager: React.FC<Props> = (props) => (
  <nav
    className={styles.pager}
    aria-label="Соседние страницы темы"
    data-subtopic-pager
  >
    {props.previous ? (
      <PagerLink
        routeSlug={props.routeSlug}
        target={props.previous}
        direction="previous"
      />
    ) : (
      <span />
    )}
    {props.next ? (
      <PagerLink
        routeSlug={props.routeSlug}
        target={props.next}
        direction="next"
      />
    ) : null}
  </nav>
);
