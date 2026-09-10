import { CourseOverviewStudy } from "./course-overview-study";
import styles from "../course-overview-page.module.css";

export const CourseOverviewAtmosphere: React.FC = () => {
  return (
    <div
      className={styles.atmosphere}
      aria-hidden="true"
      data-course-atmosphere
    >
      <div className={styles.atmosphereStudies}>
        <CourseOverviewStudy kind="sequence" />
        <CourseOverviewStudy kind="branch" />
        <CourseOverviewStudy kind="stack" />
      </div>
    </div>
  );
};
