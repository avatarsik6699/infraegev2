import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import type { LessonIntroTypes } from "./lesson-intro.types";
import styles from "./lesson-intro.module.css";

export const LessonIntro: React.FC<LessonIntroTypes.Props> = ({
  accessTier,
  className,
  eyebrow,
  summary,
  taskCount,
  technology,
  title,
}) => (
  <header className={`${styles.root} ${className ?? ""}`}>
    <div className={styles.meta} aria-label="Сведения об уроке">
      <Badge>{eyebrow}</Badge>
      <Badge>{technology}</Badge>
      <Badge>{russianCount.tasks(taskCount)}</Badge>
      <Badge>{accessTier === "free" ? "Бесплатно" : "По подписке"}</Badge>
    </div>
    <Typography.Title order={1} className={styles.title}>
      {title}
    </Typography.Title>
    <Typography.Text variant="lead" tone="muted" className={styles.lead}>
      {summary}
    </Typography.Text>
  </header>
);
