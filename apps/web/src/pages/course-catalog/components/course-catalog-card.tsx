import { useRef } from "react";
import type { CourseCatalogTypes } from "~/entities/course";
import { ActionLink } from "~/shared/components/action-link";
import { Badge } from "~/shared/components/badge";
import { Typography } from "~/shared/components/typography";
import styles from "../course-catalog-page.module.css";
import { CourseCatalogProgress } from "./course-catalog-progress";
import { CourseCatalogStudy } from "./course-catalog-study";
import { useCourseCatalogMotion } from "../model/use-course-catalog-motion";

type Props = {
  entry: CourseCatalogTypes.Entry;
};

export const CourseCatalogCard: React.FC<Props> = (props) => {
  const cardRef = useRef<HTMLElement>(null);
  const motionActive = useCourseCatalogMotion(cardRef);
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
        <span className={styles.cardMaterial} aria-hidden="true">
          <span className={styles.cardTexture}>
            <svg
              className={styles.cardEngraving}
              viewBox="0 0 320 240"
              fill="none"
            >
              <circle cx="0" cy="240" r="105" />
              <circle cx="0" cy="240" r="145" />
              <circle cx="0" cy="240" r="185" />
            </svg>
          </span>
        </span>
        <span className={styles.cardSheen} aria-hidden="true" />
        <div className={styles.cardCopy}>
          <div className={styles.cardMeta}>
            {props.entry.status === "published" ? (
              <Typography.Text component="span" className={styles.lessonCount}>
                {`${String(props.entry.lessonCount)} уроков`}
              </Typography.Text>
            ) : (
              <Badge>Скоро</Badge>
            )}
          </div>
          <Typography.Title className={styles.cardTitle} order={2}>
            {props.entry.title}
          </Typography.Title>
          <Typography.Text className={styles.cardSummary} tone="muted">
            {props.entry.summary}
          </Typography.Text>
        </div>
        <CourseCatalogStudy courseId={props.entry.id} />
        {props.entry.status === "published" ? (
          <div className={styles.cardFooter}>
            <CourseCatalogProgress entry={props.entry} />
            <ActionLink
              className={styles.cardAction}
              hierarchy="drawn"
              icon="forward"
              to="/courses/$courseSlug"
              params={{ courseSlug: props.entry.routeSlug }}
            >
              Открыть курс
            </ActionLink>
          </div>
        ) : null}
      </article>
    </li>
  );
};
