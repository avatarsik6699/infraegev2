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
import { russianCount, russianForms } from "~/shared/lib/russian-count";
import styles from "./foundation-page.module.css";

type Props = {
  course: CourseCatalogTypes.PublishedEntry;
};

const moduleForms = ["модуль", "модуля", "модулей"] as const;

/**
 * Change 185 (F57): a published course in the «Темы ЕГЭ» grid — its cover
 * across the top, then the chip, title, level, summary and facts. The whole
 * card is the link (F9).
 */
export const FoundationCourseCard: React.FC<Props> = (props) => (
  <li
    className={cssUtils.cx(styles.course, courseCover.tone)}
    data-course-tone={props.course.id}
    data-course-card={props.course.id}
  >
    <CourseCover
      entry={props.course}
      sizes="(max-width: 60rem) 92vw, 30rem"
      className={styles.coursePlate}
    />
    <div className={styles.cardMain}>
      <div className={styles.courseCopy}>
        <div className={styles.courseHead}>
          <CourseChip entry={props.course} />
          <div>
            <Typography.Title order={3} className={styles.courseTitle}>
              {props.course.title}
            </Typography.Title>
            <span className={styles.courseKind}>
              {[
                "Мини-курс",
                props.course.level && `${props.course.level} уровень`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        </div>
        <Typography.Text className={styles.courseSummary}>
          {props.course.summary}
        </Typography.Text>
      </div>
      <div className={styles.cardFoot}>
        <span className={styles.cardFacts}>
          {`${russianCount.of(props.course.moduleCount, moduleForms)} · ${russianCount.of(courseCatalog.coreLessonCount(props.course), russianForms.lesson)}${russianCount.additional(props.course.advancedLessonIds.length, "lessons")}`}
        </span>
        <ActionLink
          className={styles.stretchedLink}
          ariaLabel={`Открыть курс: ${props.course.title}`}
          hierarchy="text"
          to="/courses/$courseSlug"
          params={{ courseSlug: props.course.routeSlug }}
        >
          Открыть курс
        </ActionLink>
      </div>
    </div>
  </li>
);
