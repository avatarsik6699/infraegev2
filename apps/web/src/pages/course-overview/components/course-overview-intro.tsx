import type { CourseTypes } from "~/entities/course";
import { Laptop } from "lucide-react";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import { CourseOverviewAction } from "./course-overview-action";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";

type Props = {
  course: CourseTypes.Definition;
  overview: CourseOverviewPageTypes.Model;
};

export const CourseOverviewActions: React.FC<Props> = (props) => (
  <div className={styles.actions}>
    <CourseOverviewAction
      courseRouteSlug={props.course.routeSlug}
      action={props.overview.action}
      modules={props.overview.modules}
    />
    <FragmentLink
      hash="course-curriculum"
      presentation="action"
      hierarchy="text"
      icon={false}
      className={styles.programLink}
    >
      К программе курса ↓
    </FragmentLink>
  </div>
);

type FactsProps = {
  courseId: string;
  requirements: string;
  outcomes: readonly string[];
};

/** F24: each outcome's mark in the course's own notation — a Python comment, an Excel cell. */
const outcomeMark = (courseId: string, index: number): string =>
  courseId === "excel" ? `A${String(index + 1)}` : `# ${String(index + 1)}`;

/**
 * Change 186 (F17, F24): what the course teaches, four outcomes in a row
 * under a rule of the course's colour, then what it needs in one line.
 */
export const CourseOverviewFacts: React.FC<FactsProps> = (props) => (
  <section className={styles.about} aria-labelledby="course-outcomes">
    <Typography.Title
      order={2}
      id="course-outcomes"
      className={styles.aboutTitle}
    >
      Чему научитесь
    </Typography.Title>
    <ol className={styles.outcomes}>
      {props.outcomes.map((outcome, index) => (
        <li key={outcome} className={styles.outcome}>
          <span className={styles.outcomeMark} aria-hidden="true">
            {outcomeMark(props.courseId, index)}
          </span>
          {outcome}
        </li>
      ))}
    </ol>
    <div className={styles.needs}>
      <Laptop className={styles.needsIcon} aria-hidden="true" />
      <Typography.Text tone="muted" className={styles.needsText}>
        <strong>Что понадобится.</strong> {props.requirements}
      </Typography.Text>
    </div>
  </section>
);
