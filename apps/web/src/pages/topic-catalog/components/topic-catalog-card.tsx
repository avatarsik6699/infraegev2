import { useRef } from "react";
import { useElementActivity } from "~/shared/lib/element-activity";
import { SurfaceGlint } from "~/shared/components/surface-decoration";
import { topicCatalog, type TopicCatalogTypes } from "~/entities/topic-catalog";
import { ActionLink } from "~/shared/components/action-link";
import { Badge } from "~/shared/components/badge";
import { Image } from "~/shared/components/image";
import { Typography } from "~/shared/components/typography";
import styles from "../topic-catalog-page.module.css";

type Props = {
  entry: TopicCatalogTypes.Entry;
};

const topicIllustrationById: Readonly<
  Record<string, { src: string; position: "number" | "recursion" }>
> = {
  "preobrazovanie-zapisey-chisel": {
    src: "/topics/number-representation.webp",
    position: "number",
  },
  rekursiya: {
    src: "/topics/recursive-algorithms.webp",
    position: "recursion",
  },
};

export const TopicCatalogCard: React.FC<Props> = ({ entry }) => {
  const cardRef = useRef<HTMLElement>(null);
  const active = useElementActivity(cardRef);
  const illustration = topicIllustrationById[entry.id];

  return (
    <li
      className={styles.card}
      data-topic-card
      data-topic-status={entry.status}
    >
      <article
        ref={cardRef}
        className={styles.mapEntry}
        data-has-illustration={illustration ? "true" : undefined}
        data-topic-frame
      >
        {entry.status === "published" ? (
          <SurfaceGlint
            kind="sweep"
            active={active}
            playback="loop"
            className={styles.cardSheen}
          />
        ) : (
          <span className={styles.quietEdge} aria-hidden="true" />
        )}
        <span className={styles.cardIndex} data-topic-index aria-hidden="true">
          {entry.taskNumbers.length === 1
            ? String(entry.taskNumbers[0]).padStart(2, "0")
            : "19–21"}
        </span>
        {entry.status === "published" && illustration ? (
          <>
            <div className={styles.publishedMedia} data-topic-media>
              <span className={styles.mediaTaskNumber}>
                {topicCatalog.formatTaskNumbers(entry.taskNumbers)}
              </span>
              <Typography.Title className={styles.cardTitle} order={3}>
                {entry.title}
              </Typography.Title>
              <Typography.Text className={styles.cardSummary} tone="muted">
                {entry.summary}
              </Typography.Text>
            </div>
            <div className={styles.publishedFooter} data-topic-footer>
              <ActionLink
                className={styles.cardAction}
                hierarchy="drawn"
                icon="forward"
                to="/ege/$slug"
                params={{ slug: entry.routeSlug }}
              >
                Открыть тему
              </ActionLink>
            </div>
          </>
        ) : (
          <>
            <div className={styles.cardMeta}>
              <span className={styles.mapEntryNumber}>
                {topicCatalog.formatTaskNumbers(entry.taskNumbers)}
              </span>
              <Badge>Скоро</Badge>
            </div>
            <Typography.Title className={styles.cardTitle} order={3}>
              {entry.title}
            </Typography.Title>
            <Typography.Text className={styles.cardSummary} tone="muted">
              {entry.summary}
            </Typography.Text>
          </>
        )}
      </article>
      {entry.status === "published" && illustration ? (
        <div
          className={`${styles.cardIllustration} ${styles[illustration.position]}`}
          data-topic-illustration
          aria-hidden="true"
        >
          <Image
            className={styles.cardIllustrationMedia}
            src={illustration.src}
            decorative
            width={960}
            height={640}
            fit="contain"
          />
        </div>
      ) : null}
    </li>
  );
};
