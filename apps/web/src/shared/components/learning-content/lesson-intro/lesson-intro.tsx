import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import { cssUtils } from "~/shared/lib/css-utils";
import type { LessonIntroTypes } from "./lesson-intro.types";
import styles from "./lesson-intro.module.css";

/**
 * The head of a whole topic on its first page (Change 184 F6): the exam task
 * as a kicker, the topic title, its summary and its size, set off from the
 * first subtopic by the page head's grid and a hairline — so the subtopic
 * under it reads as one part of the topic, styled as on every other page.
 */
export const LessonIntro: React.FC<LessonIntroTypes.Props> = (props) => (
  <header
    className={cssUtils.cx(styles.root, props.className)}
    data-presentation="study"
    data-topic-head
  >
    <Typography.Text className={styles.kicker}>{props.eyebrow}</Typography.Text>
    <Typography.Title
      order={1}
      id="lesson-title"
      tabIndex={-1}
      variant="lesson"
      className={styles.title}
    >
      {props.title}
    </Typography.Title>
    <Typography.Text variant="lead" className={styles.lead}>
      {props.summary}
    </Typography.Text>

    <Typography.Text className={styles.studyMeta}>
      {[
        props.subtopicCount !== undefined
          ? russianCount.subtopics(props.subtopicCount)
          : null,
        props.taskCount !== undefined
          ? russianCount.tasks(props.taskCount)
          : null,
        props.accessTier === "paid" ? "По подписке" : null,
      ]
        .filter(Boolean)
        .join(" · ")}
    </Typography.Text>
  </header>
);
