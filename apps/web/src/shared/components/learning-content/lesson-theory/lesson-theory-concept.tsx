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
    >
      {concept.explanation}
    </Typography.Prose>
    {concept.diagram ? (
      <div className={styles.conceptVisual}>{concept.diagram}</div>
    ) : null}
    {concept.workedExample ? (
      <div className={styles.conceptExample}>{concept.workedExample}</div>
    ) : null}
    {concept.mistake ? (
      <div className={styles.conceptMistake} data-concept-mistake>
        {concept.mistake}
      </div>
    ) : null}
    {concept.checkpoint ? (
      <div className={styles.conceptCheckpoint} data-concept-checkpoint>
        <Checkpoint items={concept.checkpoint} />
      </div>
    ) : null}
  </section>
);
