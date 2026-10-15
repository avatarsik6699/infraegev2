import {
  practiceCatalog,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { examPlan, topicCatalog } from "~/entities/topic-catalog";
import { useAccountSession } from "~/features/account";
import { usePracticeProgress } from "~/features/practice-progress";
import { ActionLink } from "~/shared/components/action-link";
import { Progress } from "~/shared/components/progress";
import { Typography } from "~/shared/components/typography";
import patterns from "~/shared/styles/patterns.module.css";
import styles from "../practice-catalog-page.module.css";

type Props = {
  number: number;
  /** Catalog tasks of this number, from the facets. */
  total: number;
  /** The page's tasks of this number: a task solved here counts at once. */
  pageTasks: readonly PracticeCatalogTypes.Entry[];
};

/**
 * Change 185 (F47): the root row of an exam number in a list ordered by
 * number — the number, its topic as /ege names it, the FIPI level, the way to
 * the theory and how much of the number's practice is solved. It opens the
 * list item of the number's first task, so the list holds only tasks.
 */
export const PracticeTopicGroup: React.FC<Props> = (props) => {
  const session = useAccountSession();
  const guest = session.status === "ready" && !session.account;
  const hydrated = usePracticeProgress((state) => state.hydrated);
  const history = usePracticeProgress((state) => state.history);
  const examNumbers = usePracticeProgress((state) => state.examNumbers);
  const entry = topicCatalog.entries.find((item) =>
    item.taskNumbers.includes(props.number),
  );
  const level = examPlan.level(props.number);
  const solved = new Set([
    ...Object.keys(examNumbers).filter(
      (id) => history[id] && examNumbers[id].includes(props.number),
    ),
    ...props.pageTasks
      .filter((task) => history[task.id]?.[task.solution_revision])
      .map((task) => task.id),
  ]).size;
  return (
    <div className={styles.group} data-practice-group={props.number}>
      <span className={styles.groupNumber} aria-hidden="true">
        {props.number}
      </span>
      <div className={styles.groupTopic}>
        <Typography.Title order={2} className={styles.groupTitle}>
          <span className={patterns.visuallyHidden}>
            {`Задание ${String(props.number)}. `}
          </span>
          {entry?.title ?? `Задание ${String(props.number)}`}
        </Typography.Title>
        <span className={styles.groupMeta}>
          <span>
            <i className={styles.groupLevel} data-level={level} />
            {`${examPlan.levelTitles[level]} уровень`}
          </span>
          {entry?.status === "published" ? (
            <ActionLink to="/ege/$slug" params={{ slug: entry.routeSlug }}>
              Теория
            </ActionLink>
          ) : null}
        </span>
      </div>
      <div className={styles.groupProgress}>
        {guest ? (
          <span>{practiceCatalog.countLabel(props.total)}</span>
        ) : (
          <>
            <span>
              {hydrated
                ? `Решено ${String(solved)} из ${String(props.total)}`
                : `${practiceCatalog.countLabel(props.total)}`}
            </span>
            <Progress
              className={styles.groupBar}
              value={hydrated ? solved : null}
              max={Math.max(1, props.total)}
              label={`Решено в задании ${String(props.number)}`}
              valueText={
                hydrated
                  ? `${String(solved)} из ${String(props.total)}`
                  : undefined
              }
            />
          </>
        )}
      </div>
    </div>
  );
};
