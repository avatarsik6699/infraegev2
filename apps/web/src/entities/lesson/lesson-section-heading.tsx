import type { LessonSectionHeadingTypes } from "./lesson-section-heading.types";
import styles from "./lesson-section-heading.module.css";

export const LessonSectionHeading: React.FC<LessonSectionHeadingTypes.Props> = (
  props,
) => (
  <Typography.Title
    order={2}
    {...props}
    className={[styles.heading, props.className].filter(Boolean).join(" ")}
  >
    <span className={styles.index} aria-hidden="true">
      § {props.index} ·
    </span>
    <span>{props.children}</span>
  </Typography.Title>
);
import { Typography } from "~/shared/components/typography";
