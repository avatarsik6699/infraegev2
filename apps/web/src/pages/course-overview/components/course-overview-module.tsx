import { Progress } from "~/shared/components/progress";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import { courseOverviewModel } from "../model/course-overview-model";
import styles from "../course-overview-page.module.css";

type Props = { module: CourseOverviewPageTypes.Module };

export const CourseOverviewModule: React.FC<Props> = (props) => (
  <span className={styles.moduleHeader}>
    <span className={styles.moduleCopy} data-course-module>
      <span className={styles.moduleTitle}>{props.module.title}</span>
      <span className={styles.moduleMeta}>
        {courseOverviewModel.lessonCount(props.module.lessons.length)}
        <span> · </span> <span>{props.module.status}</span>
      </span>
    </span>
    {props.module.progress ? (
      <Progress
        className={styles.moduleBar}
        value={props.module.progress.mastered}
        max={props.module.progress.total}
        label={`Освоено уроков: ${props.module.title}`}
        valueText={`${String(props.module.progress.mastered)} из ${String(props.module.progress.total)}`}
      />
    ) : (
      <span className={styles.moduleBarPlaceholder} aria-hidden="true" />
    )}
  </span>
);
