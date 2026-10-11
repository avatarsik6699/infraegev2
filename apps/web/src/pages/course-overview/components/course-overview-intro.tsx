import type { CourseTypes } from "~/entities/course";
import { Laptop, Route } from "lucide-react";
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

export const CourseOverviewFacts: React.FC<{ requirements: string }> = (
  props,
) => (
  <div className={styles.facts}>
    <section className={styles.fact} aria-labelledby="course-requirements">
      <div className={styles.factHead}>
        <Typography.Title
          order={2}
          id="course-requirements"
          className={styles.factTitle}
        >
          Что понадобится
        </Typography.Title>
        <Laptop className={styles.factIcon} aria-hidden="true" />
      </div>
      <Typography.Text tone="muted">{props.requirements}</Typography.Text>
    </section>
    <section className={styles.fact} aria-labelledby="course-format">
      <div className={styles.factHead}>
        <Typography.Title
          order={2}
          id="course-format"
          className={styles.factTitle}
        >
          Как идёт курс
        </Typography.Title>
        <Route className={styles.factIcon} aria-hidden="true" />
      </div>
      <Typography.Text tone="muted">
        Каждый урок: объяснение, разобранный пример и практика. Прогресс
        сохраняется в аккаунте.
      </Typography.Text>
    </section>
  </div>
);
