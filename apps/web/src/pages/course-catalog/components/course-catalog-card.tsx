import { ArrowRight } from "lucide-react";
import type { CourseCatalogTypes } from "~/entities/course";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
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
  layout: "feature" | "compact" | "wide";
};

/**
 * F33/F34: every card has the same parts — description, lessons and
 * level, progress and an action. A planned course shows placeholders
 * («— уроков», «Освоено 0 из — уроков») and a disabled «Скоро».
 */
export const CourseCatalogCard: React.FC<Props> = (props) => {
  const published = props.entry.status === "published";
  return (
    <li
      className={styles.card}
      data-course-card={props.entry.id}
      data-course-status={props.entry.status}
      data-layout={props.layout}
      aria-disabled={!published || undefined}
    >
      {published && hasCourseIllustration(props.entry.id) ? (
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
        <Typography.Text tone="muted" className={styles.cardDescription}>
          {props.entry.summary}
        </Typography.Text>
        <div className={styles.metadata}>
          <span>
            {props.entry.status === "published"
              ? courseCatalogModel.lessonCount(props.entry.lessonCount)
              : "— уроков"}
          </span>
          {props.entry.level && <span>· {props.entry.level}</span>}
        </div>
      </div>
      <div className={styles.cardFooter}>
        {props.entry.status === "published" ? (
          <CourseCatalogProgress
            progress={props.progress ?? { status: "loading" }}
            total={props.entry.lessonCount}
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
            presentation="button"
            hierarchy="primary"
            to="/courses/$courseSlug"
            params={{ courseSlug: props.entry.routeSlug }}
            className={styles.courseAction}
          >
            <span className={styles.actionContent}>
              Открыть курс
              <ArrowRight
                className={styles.arrow}
                size={16}
                aria-hidden="true"
              />
            </span>
          </ActionLink>
        ) : (
          <Button disabled fullWidth className={styles.courseAction}>
            Скоро
          </Button>
        )}
      </div>
    </li>
  );
};
