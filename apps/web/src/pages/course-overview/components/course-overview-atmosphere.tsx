import { SvgPattern } from "~/shared/components/svg-pattern";
import { CourseOverviewStudy } from "./course-overview-study";
import styles from "../course-overview-page.module.css";

export const CourseOverviewAtmosphere: React.FC = () => {
  return (
    <div
      className={styles.atmosphere}
      aria-hidden="true"
      data-course-atmosphere
    >
      <svg className={styles.atmosphereGrid} width="100%" height="100%">
        <SvgPattern.Grid
          bounds={{ x: 0, y: 0, width: "100%", height: "100%" }}
          cell={{ width: 84, height: 84 }}
          transform="skewY(-18)"
          lineClassName={styles.atmosphereGridLine}
          node={{ radius: 1.5, className: styles.atmosphereGridNode }}
        />
      </svg>
      <div className={styles.atmosphereStudies}>
        <CourseOverviewStudy kind="sequence" />
        <CourseOverviewStudy kind="branch" />
        <CourseOverviewStudy kind="stack" />
      </div>
    </div>
  );
};
