import { Progress } from "~/shared/components/progress";
import { Typography } from "~/shared/components/typography";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";
import { courseOverviewModel } from "../model/course-overview-model";

type Props = { progress: CourseOverviewPageTypes.Progress };

export const CourseOverviewProgress: React.FC<Props> = (props) => (
  <section
    className={styles.progress}
    aria-labelledby="course-progress"
    data-progress-ready={props.progress.status === "ready" || undefined}
  >
    <Typography.Title
      order={2}
      id="course-progress"
      className={styles.smallHeading}
    >
      Ваш прогресс
    </Typography.Title>
    <div className={styles.progressRow}>
      <span>Практика</span>
      <span className={styles.progressCount}>
        {props.progress.status === "ready"
          ? `${String(props.progress.solved)} из ${String(props.progress.total)}`
          : "— из —"}
      </span>
      {props.progress.status === "ready" && props.progress.total > 0 ? (
        <Progress
          label="Решённые задачи курса"
          value={props.progress.solved}
          max={props.progress.total}
          valueText={`Решено ${String(props.progress.solved)} из ${String(props.progress.total)} задач`}
        />
      ) : (
        <span className={styles.progressPlaceholder} aria-hidden="true" />
      )}
    </div>
    <div className={styles.progressNote} role="status">
      {courseOverviewModel.progressNote(props.progress)}
    </div>
  </section>
);
