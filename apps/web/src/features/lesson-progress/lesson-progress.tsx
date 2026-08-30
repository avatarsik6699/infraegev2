import { Progress } from "~/shared/components/progress";
import { Typography } from "~/shared/components/typography";
import type { LessonProgressTypes } from "./lesson-progress.types";
import styles from "./lesson-progress.module.css";

export const LessonProgress: React.FC<LessonProgressTypes.Props> = ({
  headingOrder = 2,
  headingId = "lesson-progress-heading",
  ...props
}) => {
  const masteredAt = Math.ceil(props.total * props.masteryThreshold);
  const status = progressStatus(props.solved, props.total, masteredAt);

  return (
    <section className={styles.root} aria-labelledby={headingId}>
      <div className={styles.headingRow}>
        <Typography.Title
          order={headingOrder}
          id={headingId}
          className={styles.heading}
        >
          Прогресс
        </Typography.Title>
        <Typography.Text component="span" className={styles.count}>
          {`${String(props.solved)} / ${String(props.total)}`}
        </Typography.Text>
      </div>
      <Progress
        className={styles.progress}
        max={props.total}
        value={props.solved}
        label="Решённые задачи урока"
        valueText={`Решено ${String(props.solved)} из ${String(props.total)} задач`}
      />
      <Typography.Text className={styles.status} data-mastery-status>
        {status}
      </Typography.Text>
    </section>
  );
};

function progressStatus(
  solved: number,
  total: number,
  masteredAt: number,
): string {
  if (solved === total) return "Все задания решены";
  if (solved >= masteredAt) return "Урок пройден";
  if (solved === 0) return "Вы ещё не решали задания";
  return "Можно продолжить с оставшихся заданий";
}
