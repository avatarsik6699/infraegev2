import { useRef, useState } from "react";
import { useElementActivity } from "~/shared/lib/element-activity";
import {
  SurfaceGlint,
  SurfaceMaterial,
} from "~/shared/components/surface-decoration";
import { topicCatalog, type TopicCatalogTypes } from "~/entities/topic-catalog";
import { ActionLink } from "~/shared/components/action-link";
import { CustomIcon } from "~/shared/components/custom-icon";
import { Badge } from "~/shared/components/badge";
import { Image, type ImageTypes } from "~/shared/components/image";
import { Typography } from "~/shared/components/typography";
import styles from "../topic-catalog-page.module.css";

type Props = {
  entry: TopicCatalogTypes.Entry;
};

const topicIllustrationById: Readonly<Record<string, string>> = {
  "preobrazovanie-zapisey-chisel": "/topics/number-representation.webp",
  rekursiya: "/topics/recursive-algorithms.webp",
};

export const TopicCatalogCard: React.FC<Props> = ({ entry }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [imageStatus, setImageStatus] = useState<ImageTypes.Status>("loading");
  const visible = useElementActivity(cardRef);
  const active = visible && imageStatus === "loaded";
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
        data-motion-active={active || undefined}
      >
        <SurfaceMaterial className={styles.cardMaterial}>
          <span className={styles.cardTexture} />
          <span className={styles.cardPattern} />
        </SurfaceMaterial>
        {entry.status === "published" ? (
          <SurfaceGlint
            kind="frame"
            active={active}
            playback="once"
            className={styles.cardSheen}
          />
        ) : null}
        <span className={styles.cardIndex} data-topic-index aria-hidden="true">
          {entry.taskNumbers.length === 1
            ? String(entry.taskNumbers[0]).padStart(2, "0")
            : "19–21"}
        </span>
        <div className={styles.cardMedia} data-topic-media>
          <div className={styles.mediaBadges}>
            <Badge presentation="index">
              {topicCatalog.formatTaskNumbers(entry.taskNumbers)}
            </Badge>
            {entry.status === "planned" ? (
              <Badge presentation="metadata">Скоро</Badge>
            ) : null}
          </div>
          <div
            className={styles.cardIllustration}
            data-topic-illustration
            aria-hidden="true"
          >
            {illustration ? (
              <Image
                onStatusChange={setImageStatus}
                className={styles.cardIllustrationMedia}
                src={illustration}
                srcSet={`${illustration.replace("/topics/", "/topics/responsive/").replace(".webp", "-480.webp")} 480w, ${illustration} 960w`}
                sizes="(max-width: 44rem) 100vw, (max-width: 70rem) 50vw, 33vw"
                loading={
                  entry.id === "preobrazovanie-zapisey-chisel"
                    ? "eager"
                    : "lazy"
                }
                decorative
                width={960}
                height={640}
                layout="fill"
                fit="contain"
              />
            ) : (
              <div className={styles.cardPlaceholder} data-topic-placeholder>
                <CustomIcon.Book width={88} height={88} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.cardContent} data-topic-footer>
          <Typography.Title
            className={styles.cardTitle}
            variant="topic"
            order={3}
          >
            {entry.title}
          </Typography.Title>
          <Typography.Text
            className={styles.cardSummary}
            variant="summary"
            tone="muted"
          >
            {entry.summary}
          </Typography.Text>
          <div className={styles.cardBottom}>
            {entry.status === "published" ? (
              <ActionLink
                className={styles.cardAction}
                hierarchy="drawn"
                icon="forward"
                to="/ege/$slug"
                params={{ slug: entry.routeSlug }}
              >
                Открыть тему
              </ActionLink>
            ) : null}
          </div>
        </div>
      </article>
    </li>
  );
};
