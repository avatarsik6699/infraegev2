import type { LessonProgressTypes } from "./lesson-progress.types";
import styles from "./lesson-progress.module.css";

export const LessonProgress: React.FC<LessonProgressTypes.Props> = (props) => {
  const masteredAt = Math.ceil(props.total * props.masteryThreshold);
  const status =
    props.solved === props.total
      ? "Все задания решены"
      : props.solved >= masteredAt
        ? "Тема освоена"
        : props.solved === 0
          ? "Практика ещё не начата"
          : "Продолжайте практику";

  return (
    <section className={styles.root} aria-labelledby="lesson-progress-heading">
      <div className={styles.headingRow}>
        <Typography.Title order={2} id="lesson-progress-heading">
          Прогресс темы
        </Typography.Title>
        <Badge variant="outline" className={styles.count}>
          {`${String(props.solved)} / ${String(props.total)}`}
        </Badge>
      </div>
      <progress
        className={styles.progress}
        max={props.total}
        value={props.solved}
        aria-label="Решённые задачи темы"
      />
      <Typography.Text className={styles.summary}>
        {`Решено ${String(props.solved)} из ${String(props.total)} задач`}
      </Typography.Text>
      <Typography.Text className={styles.status} data-mastery-status>
        {status}
      </Typography.Text>
    </section>
  );
};
import { Badge } from "@mantine/core";
import { Typography } from "~/shared/components/typography";
