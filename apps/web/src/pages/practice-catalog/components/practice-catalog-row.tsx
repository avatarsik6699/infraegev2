import type { PracticeCatalogTypes } from "~/entities/practice-task";
import { usePracticeProgress } from "~/features/practice-progress";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import styles from "../practice-catalog-page.module.css";

export const PracticeCatalogRow: React.FC<{
  task: PracticeCatalogTypes.Entry;
}> = (props) => {
  const history = usePracticeProgress((state) => state.history[props.task.id]);
  const solved = history?.[props.task.solution_revision] !== undefined;
  let status = "";
  if (history) status = "Задача изменилась";
  if (solved) status = "Решено";
  return (
    <li className={styles.row}>
      <div className={styles.rowContent}>
        <Typography.Title order={2} className={styles.rowHeading}>
          <ActionLink
            to="/practice/$taskId"
            params={{ taskId: props.task.id }}
            hierarchy="drawn"
            presentation="inline"
          >
            {props.task.title}
          </ActionLink>
        </Typography.Title>
        <Typography.Text tone="muted" variant="caption">
          Сложность {props.task.difficulty} из 3
          {props.task.exam_numbers.length
            ? ` · ЕГЭ ${props.task.exam_numbers.join(", ")}`
            : ""}
          {props.task.estimated_minutes
            ? ` · около ${props.task.estimated_minutes} мин`
            : ""}
        </Typography.Text>
        {props.task.skills.length > 0 && (
          <Typography.Text tone="muted" variant="caption">
            {props.task.skills.join(" · ")}
          </Typography.Text>
        )}
      </div>
      <Typography.Text
        className={styles.progress}
        tone="muted"
        variant="caption"
      >
        {status}
      </Typography.Text>
    </li>
  );
};
