import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import { courseOverviewModel } from "../model/course-overview-model";
import styles from "../course-overview-page.module.css";

type Props = { module: CourseOverviewPageTypes.Module };

export const CourseOverviewModule: React.FC<Props> = (props) => (
  <span className={styles.moduleCopy} data-course-module>
    <span className={styles.moduleTitle}>{props.module.title}</span>
    <span className={styles.moduleMeta}>
      {courseOverviewModel.lessonCount(props.module.lessons.length)}
      <span> · </span> <span>{props.module.status}</span>
    </span>
  </span>
);
