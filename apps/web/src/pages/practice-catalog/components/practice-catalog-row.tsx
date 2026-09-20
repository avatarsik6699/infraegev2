import {
  ChevronDown,
  Circle,
  CircleCheck,
  CircleAlert,
  Bookmark,
  FileText,
} from "lucide-react";
import {
  practiceCatalog,
  practiceAnswerFormat,
  PracticeDifficulty,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
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
}> = (props) => {
  const history = usePracticeProgress((state) => state.history[props.task.id]);
  const hydrated = usePracticeProgress((state) => state.hydrated);
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
  const panelId = `task-panel-${props.task.id}`;
  const headingId = `task-heading-${props.task.id}`;
  return (
    <li className={styles.row} id={`task-${props.task.id}`}>
      <div className={styles.rowHeader}>
        <span
          className={styles.progress}
          role="img"
          aria-label={hydrated ? status : "Статус решения загружается"}
          title={status}
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
        <ActionLink
          presentation="navigation"
          to={practiceCatalog.taskHref(props.task.id, props.search)}
          hierarchy="text"
          className={styles.taskId}
          ariaLabel={`ID: ${props.task.id}`}
          title={props.task.id}
        >
          #{props.task.id.slice(0, 8)}
        </ActionLink>
        <div className={styles.rowContent}>
          <Typography.Title order={2} className={styles.rowHeading}>
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
              {props.task.short_description.replace(/[.…\s]+$/, "")}…
            </Typography.Text>
          )}
        </div>
        <span className={styles.topicCell}>
          {props.task.exam_numbers
            .map((number) => `ЕГЭ ${number}`)
            .join(", ") ||
            props.task.topics
              ?.map(
                (id) => props.topics?.find((topic) => topic.id === id)?.label,
              )
              .filter(Boolean)
              .join(", ") ||
            props.task.skills
              .map(
                (skill) =>
                  props.skills.find((item) => item.value === skill)?.label ??
                  skill,
              )
              .join(", ")}
        </span>
        <span className={styles.difficulty}>
          <PracticeDifficulty level={props.task.difficulty} />
        </span>
        <span className={styles.format} title={props.task.answer_instruction}>
          <FileText size={17} aria-hidden="true" />
          <span>
            {practiceAnswerFormat.label(props.task.answer_instruction)}
          </span>
        </span>
        <span className={styles.source}>
          <span
            className={styles.sourceName}
            title={source?.title ?? undefined}
          >
            {source?.title ??
              (source?.kind === "original" ? "Авторское" : "Не указан")}
          </span>
          {source?.year && !source.title?.includes(String(source.year)) && (
            <small>{source.year}</small>
          )}
        </span>
        <button
          className={styles.bookmark}
          type="button"
          disabled
          aria-label="Избранное пока недоступно"
          title="Избранное пока недоступно"
        >
          <Bookmark size={18} aria-hidden="true" />
        </button>
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
            topicHeading={
              props.topics
                ?.filter(
                  (topic) =>
                    props.task.topics?.includes(topic.id) ||
                    props.task.exam_numbers.some(
                      (number) => topic.id === `ege-${number}`,
                    ),
                )
                .map((topic) => topic.label)
                .join(" · ") ||
              props.task.exam_numbers
                .map((number) => `${number} номер`)
                .join(" · ") ||
              props.task.title
            }
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
