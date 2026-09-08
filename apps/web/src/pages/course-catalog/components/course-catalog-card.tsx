import {
  SurfaceMaterial,
  SurfaceGlint,
} from "~/shared/components/surface-decoration";
import { useRef } from "react";
import type { CourseCatalogTypes } from "~/entities/course";
import { ActionLink } from "~/shared/components/action-link";
import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import styles from "../course-catalog-page.module.css";
import { CourseCatalogProgress } from "./course-catalog-progress";
import { CourseCatalogStudy } from "./course-catalog-study";
import { useElementActivity } from "~/shared/lib/element-activity";

type Props = {
  entry: CourseCatalogTypes.Entry;
};

export const CourseCatalogCard: React.FC<Props> = (props) => {
  const cardRef = useRef<HTMLElement>(null);
  const motionActive = useElementActivity(cardRef);
  return (
    <li
      className={styles.card}
      data-course-card={props.entry.id}
      data-course-status={props.entry.status}
    >
      <article
        ref={cardRef}
        className={styles.cardSurface}
        data-motion-active={motionActive || undefined}
      >
        <SurfaceMaterial className={styles.cardMaterial}>
          <span className={styles.cardTexture} />
          <span className={styles.cardPattern} />
          <span className={styles.cardEngraving} />
          <SurfaceGlint
            kind="soft"
            active={motionActive}
            playback="once"
            className={styles.cardLustre}
          />
        </SurfaceMaterial>
        {props.entry.status === "published" ? (
          <SurfaceGlint
            kind="frame"
            active={motionActive}
            className={styles.cardSheen}
          />
        ) : null}
        <div className={styles.cardMedia} data-course-media>
          <CourseCatalogStudy courseId={props.entry.id} />
        </div>
        <div className={styles.cardMeta} data-course-meta>
          {props.entry.status === "published" ? (
            <>
              <Badge>{`${String(props.entry.lessonCount)} уроков`}</Badge>
              <CourseCatalogProgress entry={props.entry} />
            </>
          ) : (
            <Badge>Скоро</Badge>
          )}
        </div>
        <div className={styles.cardCopy}>
          <Typography.Title className={styles.cardTitle} order={2}>
            {props.entry.title}
          </Typography.Title>
          <Typography.Text className={styles.cardSummary} tone="muted">
            {props.entry.summary}
          </Typography.Text>
          <div className={styles.cardFooter}>
            {props.entry.status === "published" ? (
              <ActionLink
                className={styles.cardAction}
                hierarchy="drawn"
                icon="forward"
                to="/courses/$courseSlug"
                params={{ courseSlug: props.entry.routeSlug }}
              >
                Открыть курс
              </ActionLink>
            ) : null}
          </div>
        </div>
      </article>
    </li>
  );
};
