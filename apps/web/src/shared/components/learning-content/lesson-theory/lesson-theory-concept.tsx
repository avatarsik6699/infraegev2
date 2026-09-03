import { Typography } from "~/shared/components/typography";
import { Checkpoint } from "../checkpoint";
import type { LessonTheoryTypes } from "./lesson-theory.types";
import styles from "./lesson-theory.module.css";

type LessonTheoryConceptProps = {
  concept: LessonTheoryTypes.Concept;
};

export const LessonTheoryConcept: React.FC<LessonTheoryConceptProps> = ({
  concept,
}) => (
  <section className={styles.concept} id={concept.id}>
    <Typography.Title order={3} className={styles.conceptTitle}>
      {concept.navLabel}
    </Typography.Title>
    <Typography.Prose
      className={styles.conceptExplanation}
      data-concept-explanation
      data-learning-flow
    >
      {concept.explanation}
    </Typography.Prose>
    {concept.diagram ? (
      <div className={styles.conceptVisual} data-learning-block>
        {concept.diagram}
      </div>
    ) : null}
    {concept.workedExample ? (
      <div className={styles.conceptExample} data-learning-block>
        {concept.workedExample}
      </div>
    ) : null}
    {concept.mistake ? (
      <div
        className={styles.conceptMistake}
        data-concept-mistake
        data-learning-block
      >
        {concept.mistake}
      </div>
    ) : null}
    {concept.checkpoint ? (
      <div
        className={styles.conceptCheckpoint}
        data-concept-checkpoint
        data-learning-block
      >
        <Checkpoint items={concept.checkpoint} />
      </div>
    ) : null}
  </section>
);
