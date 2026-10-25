import {
  courseCatalog,
  CourseChip,
  CourseCover,
  courseCover,
  type CourseCatalogTypes,
} from "~/entities/course";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { cssUtils } from "~/shared/lib/css-utils";
import { russianCount } from "~/shared/lib/russian-count";
import type { CourseCatalogPageTypes } from "../course-catalog-page.types";
import { courseCatalogModel } from "../model/course-catalog-model";
import { CourseCatalogProgress } from "./course-catalog-progress";
import styles from "../course-catalog-page.module.css";

type Props = {
  entry: CourseCatalogTypes.Entry;
  progress?: CourseCatalogPageTypes.Progress;
  /** The first card's cover is the page's largest paint. */
  priority?: boolean;
};

/**
 * Change 185 (after the home's colour cards): the course cover (F26), the
 * icon square, title, level and lessons, the description, then progress and
 * the action. A published card is a link
 * as a whole and has its own tone; a planned one is neutral, shows «— уроков»
 * and «Освоено 0 из — уроков» and a quiet «Скоро», never a link.
 */
export const CourseCatalogCard: React.FC<Props> = (props) => {
  const published = props.entry.status === "published";
  const lessons =
    props.entry.status === "published"
      ? `${courseCatalogModel.lessonCount(courseCatalog.coreLessonCount(props.entry))}${russianCount.additional(props.entry.advancedLessonIds.length, "lessons")}`
      : "— уроков";
  return (
    <li
      className={cssUtils.cx(styles.card, courseCover.tone)}
      data-course-card={props.entry.id}
      data-course-status={props.entry.status}
      data-course-tone={published ? props.entry.id : undefined}
      aria-disabled={!published || undefined}
    >
      <CourseCover
        entry={props.entry}
        sizes="(max-width: 40rem) 92vw, 34rem"
        priority={props.priority}
        className={styles.plate}
      />
      <div className={styles.cardContent}>
        <CourseChip entry={props.entry} className={styles.chip} />
        <Typography.Title order={2} className={styles.cardTitle}>
          {props.entry.title}
        </Typography.Title>
        <Typography.Text className={styles.metadata}>
          {[
            props.entry.level ? `${props.entry.level} уровень` : undefined,
            lessons,
          ]
            .filter(Boolean)
            .join(" · ")}
        </Typography.Text>
        <Typography.Text className={styles.cardDescription}>
          {props.entry.summary}
        </Typography.Text>
      </div>
      <div className={styles.cardFooter}>
        {props.entry.status === "published" ? (
          <CourseCatalogProgress
            progress={props.progress ?? { status: "loading" }}
            // additional lessons stay outside mastery, as in the model
            total={courseCatalog.coreLessonCount(props.entry)}
            title={props.entry.title}
          />
        ) : (
          <div className={styles.personalProgress}>
            <span className={styles.progressPlaceholder} aria-hidden="true" />
            <span>Освоено 0 из — уроков</span>
          </div>
        )}
        {props.entry.status === "published" ? (
          <ActionLink
            hierarchy="text"
            to="/courses/$courseSlug"
            params={{ courseSlug: props.entry.routeSlug }}
            className={styles.courseAction}
          >
            Открыть курс
          </ActionLink>
        ) : (
          <span className={styles.soon}>Скоро</span>
        )}
      </div>
    </li>
  );
};
