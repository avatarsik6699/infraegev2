import type { LessonContent } from "~/entities/lesson";
import { Checkpoint } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { usePaidContent } from "~/shared/lib/paid-content";
import styles from "../topic-lesson.module.css";

type Props = {
  lesson: LessonContent.Definition;
  /** A paid final page the visitor cannot open (Change 192). */
  locked: boolean;
};

/** «Итог», «Проверка решения» and the topic self-check of «Практика и итог»;
 * a paid final page reads them from its paid module (Change 192). */
export const PracticeBody: React.FC<Props> = (props) => {
  const paid = usePaidContent(
    props.locked ? undefined : props.lesson.paidPractice?.load,
  );
  if (props.locked) return null;
  const content = paid ?? props.lesson;
  return (
    <>
      <div id="result" className={styles.summary} data-topic-summary>
        <Typography.Prose>{content.result}</Typography.Prose>
      </div>

      {content.examFocus ? (
        <section
          id="exam-focus"
          className={styles.section}
          aria-labelledby="exam-focus-title"
        >
          <Typography.Title
            order={2}
            id="exam-focus-title"
            className={styles.sectionTitle}
          >
            Проверка решения
          </Typography.Title>
          <Typography.Prose>{content.examFocus}</Typography.Prose>
        </section>
      ) : null}

      {content.checkpoint ? (
        <div id="self-check" className={styles.section}>
          <Checkpoint
            items={content.checkpoint}
            headingClassName={styles.sectionTitle}
          />
        </div>
      ) : null}
    </>
  );
};
