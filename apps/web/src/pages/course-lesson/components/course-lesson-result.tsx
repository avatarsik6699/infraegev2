import type { CourseTypes } from "~/entities/course";
import { Checkpoint } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import styles from "~/shared/styles/lesson-layout.module.css";

type Props = {
  lesson: CourseTypes.LessonDefinition;
};

export const CourseLessonResult: React.FC<Props> = (props) => (
  <div className={styles.resultGrid}>
    <div className={styles.resultSummary}>
      <Typography.Prose>{props.lesson.result}</Typography.Prose>
      {props.lesson.checkpoint ? (
        <Checkpoint items={props.lesson.checkpoint} headingOrder={3} />
      ) : null}
    </div>
  </div>
);
