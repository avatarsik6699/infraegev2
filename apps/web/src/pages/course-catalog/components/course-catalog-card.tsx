import { ArrowRight } from "lucide-react";
import type { CourseCatalogTypes } from "~/entities/course";
import { ActionLink } from "~/shared/components/action-link";
import { Badge } from "~/shared/components/badge";
import { IllustrationPlaceholder } from "~/shared/components/illustration-placeholder";
import {
  hasCourseIllustration,
  ObjectIllustration,
} from "~/shared/components/object-illustration";
import { Typography } from "~/shared/components/typography";
import type { CourseCatalogPageTypes } from "../course-catalog-page.types";
import { courseCatalogModel } from "../model/course-catalog-model";
import { CourseCatalogProgress } from "./course-catalog-progress";
import styles from "../course-catalog-page.module.css";

type Props = {
  entry: CourseCatalogTypes.Entry;
  progress?: CourseCatalogPageTypes.Progress;
};

export const CourseCatalogCard: React.FC<Props> = (props) => (
  <li
    className={styles.card}
    data-course-card={props.entry.id}
    data-course-status={props.entry.status}
    aria-disabled={props.entry.status === "planned" || undefined}
  >
    {props.entry.status === "published" &&
    hasCourseIllustration(props.entry.id) ? (
      <ObjectIllustration
        course={props.entry.id}
        wide
        className={styles.illustration}
      />
    ) : (
      <IllustrationPlaceholder className={styles.illustration} />
    )}
    <div className={styles.cardContent}>
      <Typography.Title order={2} className={styles.cardTitle}>
        {props.entry.title}
      </Typography.Title>
      {props.entry.status === "planned" ? (
        <Badge
          presentation="metadata"
          surface="quiet"
          className={styles.plannedBadge}
        >
          Скоро
        </Badge>
      ) : (
        <Typography.Text tone="muted" className={styles.cardDescription}>
          {props.entry.summary}
        </Typography.Text>
      )}
      {props.entry.status === "published" && (
        <div className={styles.metadata}>
          <span>{courseCatalogModel.lessonCount(props.entry.lessonCount)}</span>
          {props.entry.level && <span>· {props.entry.level}</span>}
        </div>
      )}
      {props.entry.status === "published" && props.entry.outcome && (
        <Typography.Text className={styles.cardOutcome}>
          {props.entry.outcome}
        </Typography.Text>
      )}
    </div>
    {props.entry.status === "published" && (
      <div className={styles.cardFooter}>
        <CourseCatalogProgress
          progress={props.progress ?? { status: "loading" }}
          total={props.entry.lessonCount}
          title={props.entry.title}
        />
        <ActionLink
          presentation="button"
          hierarchy="primary"
          to="/courses/$courseSlug"
          params={{ courseSlug: props.entry.routeSlug }}
          className={styles.courseAction}
        >
          <span className={styles.actionContent}>
            Открыть курс
            <ArrowRight className={styles.arrow} size={16} aria-hidden="true" />
          </span>
        </ActionLink>
      </div>
    )}
  </li>
);
