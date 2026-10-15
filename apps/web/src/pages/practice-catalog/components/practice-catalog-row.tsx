import { ChevronDown, Circle, CircleCheck, CircleAlert } from "lucide-react";
import {
  practiceCatalog,
  practiceTaskNotation,
  PracticeDifficulty,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { topicCatalog } from "~/entities/topic-catalog";
import { useAccountSession } from "~/features/account";
import { usePracticeProgress } from "~/features/practice-progress";
import { PracticeTask } from "~/widgets/practice-task";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { useInlineTask } from "../model/use-inline-task";
import styles from "../practice-catalog-page.module.css";

export const PracticeCatalogRow: React.FC<{
  task: PracticeCatalogTypes.Entry;
  open: boolean;
  onToggle: () => void;
  search: PracticeCatalogTypes.Search;
  skills: PracticeCatalogTypes.Facets["skills"];
  topics?: PracticeCatalogTypes.Topic[];
  /** F47: 3 under a topic row, 2 in an ungrouped list. */
  headingOrder?: 2 | 3;
  /** F47: the topic row that opens this number's tasks, if this is the first. */
  group?: React.ReactNode;
}> = (props) => {
  const history = usePracticeProgress((state) => state.history[props.task.id]);
  const hydrated = usePracticeProgress((state) => state.hydrated);
  const session = useAccountSession();
  // F46 (П14): a guest's status is unknown, not «не решено» — no icon.
  const guest = session.status === "ready" && !session.account;
  const enhanced = useIsEnhanced();
  const model = useInlineTask(props.task.id, props.open);
  const detail = model.result?.detail;
  const revision =
    detail?.task.solutionRevision ?? props.task.solution_revision;
  const solved = history?.[revision] !== undefined;
  let status = "Не решено";
  if (history) status = "Задача изменилась";
  if (solved) status = "Решено";
  const source =
    props.task.sources?.find((item) => item.primary) ?? props.task.sources?.[0];
  const topic = rowModel.topic(
    props.task,
    props.topics,
    props.skills,
    props.headingOrder === 3,
  );
  const panelId = `task-panel-${props.task.id}`;
  const headingId = `task-heading-${props.task.id}`;
  return (
    <li className={styles.row} id={`task-${props.task.id}`}>
      {props.group}
      <div className={styles.rowHeader}>
        {guest ? (
          <span className={styles.progress} aria-hidden="true" />
        ) : (
          <span
            className={styles.progress}
            role="img"
            aria-label={hydrated ? status : "Статус решения загружается"}
            title={status}
            data-solved={(solved && hydrated) || undefined}
          >
            {solved && hydrated ? (
              <CircleCheck size={19} aria-hidden="true" />
            ) : null}
            {!solved && hydrated && history ? (
              <CircleAlert size={19} aria-hidden="true" />
            ) : null}
            {(!hydrated || (!solved && !history)) && (
              <Circle size={19} aria-hidden="true" />
            )}
          </span>
        )}
        <div className={styles.rowContent}>
          <Typography.Title
            order={props.headingOrder ?? 2}
            className={styles.rowHeading}
          >
            {enhanced ? (
              <button
                type="button"
                id={headingId}
                className={styles.trigger}
                aria-expanded={props.open}
                aria-controls={panelId}
                onClick={props.onToggle}
              >
                {props.task.title}
              </button>
            ) : (
              <ActionLink
                presentation="navigation"
                to={practiceCatalog.taskHref(props.task.id, props.search)}
                hierarchy="text"
                className={styles.trigger}
              >
                {props.task.title}
              </ActionLink>
            )}
          </Typography.Title>
          {props.task.short_description && (
            <Typography.Text className={styles.preview}>
              {rowModel.preview(props.task.short_description)}
            </Typography.Text>
          )}
        </div>
        <div className={styles.rowMeta}>
          <span className={styles.topicCell}>
            <span className={styles.topicNumber}>{topic.number}</span>
            <span className={styles.topicName} title={topic.name}>
              {topic.name}
            </span>
          </span>
          <span className={styles.difficulty}>
            <PracticeDifficulty level={props.task.difficulty} />
          </span>
          <span className={styles.source}>
            <span
              className={styles.sourceName}
              title={source?.title ?? undefined}
            >
              {source?.title ??
                (source?.kind === "original" ? "Авторское" : "—")}
            </span>
            {source?.year && !source.title?.includes(String(source.year)) && (
              <small>{source.year}</small>
            )}
          </span>
        </div>
        <span className={styles.scriptedOnly}>
          <button
            type="button"
            className={styles.disclosure}
            aria-label={`${props.open ? "Свернуть" : "Раскрыть"} задание: ${props.task.title}`}
            aria-expanded={props.open}
            aria-controls={panelId}
            onClick={props.onToggle}
          >
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={styles.chevron}
              data-open={props.open}
            />
          </button>
        </span>
      </div>
      <div
        id={panelId}
        aria-labelledby={headingId}
        hidden={!props.open}
        className={styles.expanded}
      >
        {model.loading && (
          <Typography.Text role="status">Загружаем задачу…</Typography.Text>
        )}
        {detail && model.result && (
          <PracticeTask
            taskHref={practiceCatalog.taskHref(props.task.id, props.search)}
            task={detail.task}
            links={model.result.links}
            onRefresh={model.refresh}
            active={props.open}
            presentation="catalog"
          />
        )}
        {model.result && !detail && (
          <div className={styles.inlineError} role="alert">
            <Typography.Text>
              {model.result.status === "missing"
                ? "Задача больше недоступна. Выберите другую задачу."
                : "Не удалось загрузить задачу. Попробуйте ещё раз."}
            </Typography.Text>
            {model.result.status === "unavailable" && (
              <Button
                hierarchy="secondary"
                loading={model.loading}
                onClick={() => {
                  void model.load();
                }}
              >
                Повторить загрузку задачи
              </Button>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

/**
 * Change 185 (F46): «Тема» in two even lines — «№ 16» and the topic as /ege
 * names it (the skill under a topic row, F47); a course task splits its facet
 * label («Python · Старт»).
 */
const rowModel = {
  /** The condition's question; a snippet cut mid-sentence ends with «…». */
  preview: (text: string) => {
    const plain = practiceTaskNotation.plain(text).trim();
    return /[.?!)»:]$/u.test(plain)
      ? plain
      : `${plain.replace(/[,;\s]+$/u, "")}…`;
  },
  topic: (
    task: PracticeCatalogTypes.Entry,
    topics: PracticeCatalogTypes.Topic[] | undefined,
    skills: PracticeCatalogTypes.Facets["skills"],
    grouped: boolean,
  ) => {
    const numbers = task.exam_numbers;
    const skill = skills.find((item) => task.skills.includes(item.value));
    if (numbers.length) {
      const entry = topicCatalog.entries.find((item) =>
        item.taskNumbers.includes(numbers[0]),
      );
      const facet = topics?.find(
        (item) => item.id === `ege-${String(numbers[0])}`,
      );
      // F47: under a topic row the topic is said once; the skill tells the
      // tasks of one number apart.
      return {
        number: `№ ${numbers.length > 1 ? `${String(numbers[0])}–${String(numbers.at(-1))}` : String(numbers[0])}`,
        name:
          (grouped ? skill?.label : undefined) ??
          entry?.title ??
          practiceCatalog
            .topicLabel(facet?.label ?? "")
            .replace(/^ЕГЭ \S+ · /u, ""),
      };
    }
    const label =
      task.topics
        ?.map((id) => topics?.find((item) => item.id === id)?.label)
        .find(Boolean) ??
      skill?.label ??
      "";
    const [group, ...rest] = label.split(" · ");
    return {
      number: rest.length ? group : "",
      name: rest.join(" · ") || group,
    };
  },
};
