import { useId } from "react";
import { CourseOverviewStudy } from "./course-overview-study";
import styles from "../course-overview-page.module.css";

export const CourseOverviewAtmosphere: React.FC = () => {
  const gridId = useId();
  return (
    <div
      className={styles.atmosphere}
      aria-hidden="true"
      data-course-atmosphere
    >
      <svg className={styles.atmosphereGrid} width="100%" height="100%">
        <defs>
          <pattern
            id={gridId}
            width="84"
            height="84"
            patternUnits="userSpaceOnUse"
            patternTransform="skewY(-18)"
          >
            <path
              d="M84 0H0V84"
              className={styles.atmosphereGridLine}
              fill="none"
            />
            <circle
              cx="0"
              cy="0"
              r="1.5"
              className={styles.atmosphereGridNode}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>
      <div className={styles.atmosphereStudies}>
        <CourseOverviewStudy kind="sequence" />
        <CourseOverviewStudy kind="branch" />
        <CourseOverviewStudy kind="stack" />
      </div>
    </div>
  );
};
