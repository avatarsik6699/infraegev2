import { ChevronRight } from "lucide-react";
import {
  examPlan,
  topicCatalog,
  type TopicCatalogTypes,
} from "~/entities/topic-catalog";
import { ActionLink } from "~/shared/components/action-link";
import { ObjectIllustration } from "~/shared/components/object-illustration";
import { Typography } from "~/shared/components/typography";
import type { TopicCatalogPageTypes } from "../topic-catalog-page.types";
import { topicCatalogModel } from "../model/topic-catalog-model";
import { TopicCatalogMarks } from "./topic-catalog-marks";
import { TopicCatalogProgress } from "./topic-catalog-progress";
import styles from "../topic-catalog-page.module.css";

type Props = {
  entry: TopicCatalogTypes.Entry;
  progress?: TopicCatalogPageTypes.Progress;
  loadState: TopicCatalogPageTypes.LoadState;
  goal: TopicCatalogTypes.Goal;
};

/**
 * Change 185 (F30–F32, variant C): one anatomy for every row — the picture,
 * «Задание N · level», title and description, then progress. The large task
 * numeral sits on the right under the progress, cropped by the row, with a
 * few pen marks over the row. Planned rows show «— задач» and «Скоро»; rows
 * outside the chosen goal go quiet.
 */
export const TopicCatalogCard: React.FC<Props> = (props) => {
  const published = props.entry.status === "published";
  const levelParts = topicCatalogModel.levelParts(props.entry.taskNumbers);
  return (
    <li
      id={`topic-${props.entry.id}`}
      className={styles.card}
      data-topic-card
      data-topic-id={props.entry.id}
      data-topic-status={props.entry.status}
      data-in-goal={examPlan.inGoal(props.entry.taskNumbers, props.goal)}
    >
      <TopicCatalogMarks
        topicId={props.entry.id}
        className={styles.marks}
        markClassName={styles.mark}
      />
      <span
        className={styles.numeral}
        data-topic-numeral
        data-grouped={props.entry.taskNumbers.length > 1}
        aria-hidden="true"
      >
        {topicCatalogModel.number(props.entry.taskNumbers)}
      </span>
      <ObjectIllustration
        topic={props.entry.taskNumbers[0]}
        className={styles.illustration}
      />
      <div className={styles.cardContent}>
        <span className={styles.task}>
          {topicCatalog.formatTaskNumbers(props.entry.taskNumbers)}
          {" · "}
          <span className={styles.levelDots} aria-hidden="true">
            {examPlan.levels(props.entry.taskNumbers).map((level, index) => (
              <i key={String(index)} data-level={level} />
            ))}
          </span>
          {levelParts.level}
          {levelParts.detail ? (
            <span
              className={styles.taskDetail}
            >{` · ${levelParts.detail}`}</span>
          ) : null}
          {published ? null : <span className={styles.planned}>Скоро</span>}
        </span>
        <Typography.Title order={2} className={styles.cardTitle}>
          {props.entry.status === "published" ? (
            <ActionLink
              className={styles.topicLink}
              presentation="navigation"
              to="/ege/$slug/$subtopic"
              params={{
                slug: props.entry.routeSlug,
                subtopic: props.entry.firstSubtopic,
              }}
            >
              {props.entry.title}
            </ActionLink>
          ) : (
            props.entry.title
          )}
        </Typography.Title>
        <Typography.Text tone="muted" className={styles.cardSummary}>
          {props.entry.summary}
        </Typography.Text>
      </div>
      {published ? (
        <TopicCatalogProgress
          progress={props.progress}
          loadState={props.loadState}
          title={props.entry.title}
        />
      ) : (
        <div className={styles.progressSlot} data-topic-progress="planned">
          <span className={styles.metadata}>Теория · — задач</span>
          <div className={styles.personalProgressSlot}>
            <div className={styles.personalProgress}>
              <span className={styles.progressPlaceholder} aria-hidden="true" />
              <span>Решено — из —</span>
            </div>
          </div>
        </div>
      )}
      <span className={styles.rowAction} aria-hidden="true">
        {published ? (
          <ChevronRight className={styles.arrow} size={20} strokeWidth={1.5} />
        ) : null}
      </span>
    </li>
  );
};
