import { Typography } from "~/shared/components/typography";
import type { LessonSectionHeadingTypes } from "./lesson-section-heading.types";
import styles from "./lesson-section-heading.module.css";

export const LessonSectionHeading: React.FC<
  LessonSectionHeadingTypes.Props
> = ({ children, className, index, variant = "default", ...props }) => (
  <Typography.Title
    order={2}
    {...props}
    data-variant={variant}
    className={[styles.heading, className].filter(Boolean).join(" ")}
  >
    <span className={styles.index} aria-hidden="true">
      § {index} ·
    </span>
    <span>{children}</span>
  </Typography.Title>
);
