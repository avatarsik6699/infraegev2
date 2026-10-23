import type { LessonContent } from "~/entities/lesson";
import { Checkpoint, LessonTheory } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { usePaidContent } from "~/shared/lib/paid-content";
import layout from "~/shared/styles/lesson-layout.module.css";
import styles from "../topic-lesson.module.css";

type Props = {
  lesson: LessonContent.Definition;
  /** A paid final page the visitor cannot open (Change 192). */
  locked: boolean;
};

/** The body of «Практика и итог» (T254): the sections, «Итог» and the topic
 * self-check, as in the course summary; a paid final page reads them from its
 * paid module (Change 192). */
export const PracticeBody: React.FC<Props> = (props) => {
  const paid = usePaidContent(
    props.locked ? undefined : props.lesson.paidPractice?.load,
  );
  if (props.locked) return null;
  const content = paid ?? props.lesson;
  const sections = (paid ? paid.sections : props.lesson.finalSections) ?? [];
  const checkpoint = content.checkpoint ? (
    <div id="self-check" className={styles.section}>
      <Checkpoint
        items={content.checkpoint}
        headingClassName={styles.sectionTitle}
      />
    </div>
  ) : null;

  return (
    <>
      <LessonTheory
        variant="page"
        concepts={sections}
        conceptHeadingOrder={2}
      />
      <section
        id="result"
        className={styles.section}
        aria-labelledby="result-title"
      >
        <Typography.Title
          order={2}
          id="result-title"
          className={styles.sectionTitle}
        >
          Итог
        </Typography.Title>
        <div className={layout.resultGrid}>
          <div className={layout.resultSummary}>
            <Typography.Prose>{content.result}</Typography.Prose>
          </div>
        </div>
      </section>
      {checkpoint}
    </>
  );
};
