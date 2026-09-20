import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import { cssUtils } from "~/shared/lib/css-utils";
import type { LessonIntroTypes } from "./lesson-intro.types";
import styles from "./lesson-intro.module.css";

export const LessonIntro: React.FC<LessonIntroTypes.Props> = (props) => (
  <header
    className={cssUtils.cx(styles.root, props.className)}
    data-presentation="study"
  >
    <Typography.Title
      order={1}
      id="lesson-title"
      tabIndex={-1}
      variant="lesson"
      className={styles.title}
    >
      {props.title}
    </Typography.Title>
    <Typography.Text variant="lead" tone="muted" className={styles.lead}>
      {props.summary}
    </Typography.Text>

    <Typography.Text className={styles.studyMeta}>
      {props.eyebrow} · {russianCount.tasks(props.taskCount)}
      {props.accessTier === "paid" ? " · По подписке" : null}
    </Typography.Text>
  </header>
);
