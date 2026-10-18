import type { CourseTypes } from "~/entities/course";
import { Checkpoint } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { usePaidContent } from "~/shared/lib/paid-content";
import styles from "~/shared/styles/lesson-layout.module.css";

type Props = {
  lesson: CourseTypes.LessonDefinition;
  /** A paid lesson the visitor cannot open (Change 192). */
  locked: boolean;
};

/** A paid lesson reads its result and self-check from its paid module (Change 192). */
export const CourseLessonResult: React.FC<Props> = (props) => {
  const paid = usePaidContent(
    props.locked ? undefined : props.lesson.paid?.load,
  );
  if (props.locked) return null;
  const content = paid ?? props.lesson;
  return (
    <div className={styles.resultGrid}>
      <div className={styles.resultSummary}>
        <Typography.Prose>{content.result}</Typography.Prose>
        {content.checkpoint ? (
          <Checkpoint items={content.checkpoint} headingOrder={3} />
        ) : null}
      </div>
    </div>
  );
};
