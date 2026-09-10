import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import { cssUtils } from "~/shared/lib/css-utils";
import type { LessonIntroTypes } from "./lesson-intro.types";
import styles from "./lesson-intro.module.css";

export const LessonIntro: React.FC<LessonIntroTypes.Props> = (props) => (
  <header
    className={cssUtils.cx(styles.root, props.className)}
    data-presentation={props.presentation}
  >
    {props.presentation !== "study" ? (
      <div className={styles.meta} aria-label="Сведения об уроке">
        <Badge>{props.eyebrow}</Badge>
        <Badge>{props.technology}</Badge>
        <Badge>{russianCount.tasks(props.taskCount)}</Badge>
        <Badge>
          {props.accessTier === "free" ? "Бесплатно" : "По подписке"}
        </Badge>
      </div>
    ) : null}
    <Typography.Title order={1} className={styles.title}>
      {props.title}
    </Typography.Title>
    <Typography.Text variant="lead" tone="muted" className={styles.lead}>
      {props.summary}
    </Typography.Text>
    {props.presentation === "study" ? (
      <Typography.Text className={styles.studyMeta}>
        {props.eyebrow} · {russianCount.tasks(props.taskCount)}
        {props.accessTier === "paid" ? " · По подписке" : null}
      </Typography.Text>
    ) : null}
  </header>
);
