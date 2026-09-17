import {
  practiceCatalog,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { usePracticeProgress } from "~/features/practice-progress";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import styles from "../practice-catalog-page.module.css";

export const PracticeCatalogRow: React.FC<{
  task: PracticeCatalogTypes.Entry;
  search: PracticeCatalogTypes.Search;
}> = (props) => {
  const history = usePracticeProgress((state) => state.history[props.task.id]);
  const hydrated = usePracticeProgress((state) => state.hydrated);
  const solved = history?.[props.task.solution_revision] !== undefined;
  let status = "";
  if (history) status = "Задача изменилась";
  if (solved) status = "Решено";
  return (
    <li className={styles.row} id={`task-${props.task.id}`}>
      <div className={styles.rowContent}>
        <Typography.Title order={2} className={styles.rowHeading}>
          <ActionLink
            to={practiceCatalog.taskHref(props.task.id, {
              ...props.search,
            })}
            hierarchy="text"
            presentation="inline"
          >
            {props.task.title}
          </ActionLink>
        </Typography.Title>
        {props.task.short_description && (
          <Typography.Text className={styles.preview}>
            {props.task.short_description}
          </Typography.Text>
        )}
        <Typography.Text tone="muted" variant="caption">
          {practiceCatalog.difficultyLabel(props.task.difficulty)}
          {props.task.exam_numbers.length
            ? ` · ЕГЭ ${props.task.exam_numbers.join(", ")}`
            : ""}
          {props.task.estimated_minutes
            ? ` · около ${props.task.estimated_minutes} мин`
            : ""}
        </Typography.Text>
      </div>
      <Typography.Text
        className={styles.progress}
        tone="muted"
        variant="caption"
      >
        {hydrated ? status : ""}
      </Typography.Text>
    </li>
  );
};
