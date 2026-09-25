import { ArrowRight } from "lucide-react";
import { topicCatalog, type TopicCatalogTypes } from "~/entities/topic-catalog";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import type { TopicCatalogPageTypes } from "../topic-catalog-page.types";
import { topicCatalogModel } from "../model/topic-catalog-model";
import { TopicCatalogIllustration } from "./topic-catalog-illustration";
import { TopicCatalogProgress } from "./topic-catalog-progress";
import patterns from "~/shared/styles/patterns.module.css";
import styles from "../topic-catalog-page.module.css";

type Props = {
  entry: TopicCatalogTypes.Entry;
  progress?: TopicCatalogPageTypes.Progress;
  loadState: TopicCatalogPageTypes.LoadState;
};
export const TopicCatalogCard: React.FC<Props> = (props) => (
  <li
    className={styles.card}
    data-topic-card
    data-topic-id={props.entry.id}
    data-topic-status={props.entry.status}
  >
    <span
      className={styles.cardIndex}
      data-grouped={props.entry.taskNumbers.length > 1}
    >
      <span aria-hidden="true">
        {topicCatalogModel.number(props.entry.taskNumbers)}
      </span>
      <span className={patterns.visuallyHidden}>
        {topicCatalog.formatTaskNumbers(props.entry.taskNumbers)}
      </span>
    </span>
    <TopicCatalogIllustration illustration={props.entry.illustration} />
    <div className={styles.cardContent}>
      <Typography.Title order={2} className={styles.cardTitle}>
        {props.entry.status === "published" ? (
          <ActionLink
            className={styles.topicLink}
            presentation="navigation"
            to="/ege/$slug"
            params={{ slug: props.entry.routeSlug }}
          >
            {props.entry.title}
          </ActionLink>
        ) : (
          props.entry.title
        )}
      </Typography.Title>
      <Typography.Text tone="muted">{props.entry.summary}</Typography.Text>
    </div>
    {props.entry.status === "published" ? (
      <TopicCatalogProgress
        progress={props.progress}
        loadState={props.loadState}
        title={props.entry.title}
      />
    ) : (
      <span className={styles.planned}>Скоро</span>
    )}
    <span className={styles.rowAction} aria-hidden="true">
      {props.entry.status === "published" && (
        <>
          <span
            className={styles.resume}
            data-visible={Boolean(
              props.progress &&
              props.progress.solved > 0 &&
              props.progress.solved < props.progress.total,
            )}
          >
            Продолжить
          </span>
          <ArrowRight className={styles.arrow} size={22} strokeWidth={1.5} />
        </>
      )}
    </span>
  </li>
);
