import { topicCatalog, type TopicCatalogTypes } from "~/entities/topic-catalog";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import styles from "../topic-catalog-page.module.css";

type Props = { entry: TopicCatalogTypes.Entry };
export const TopicCatalogCard: React.FC<Props> = (props) => (
  <li
    className={styles.card}
    data-topic-card
    data-topic-status={props.entry.status}
  >
    <span className={styles.cardIndex}>
      {topicCatalog.formatTaskNumbers(props.entry.taskNumbers)}
    </span>
    <div className={styles.cardContent}>
      <Typography.Title order={2} className={styles.cardTitle}>
        {props.entry.status === "published" ? (
          <ActionLink
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
      {props.entry.status === "planned" ? (
        <Typography.Text tone="muted">В плане</Typography.Text>
      ) : null}
    </div>
  </li>
);
