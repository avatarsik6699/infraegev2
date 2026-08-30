import { LessonSectionHeading } from "../lesson-section-heading";
import { LessonTheoryConcept } from "./lesson-theory-concept";
import type { LessonTheoryTypes } from "./lesson-theory.types";
import styles from "./lesson-theory.module.css";

export const LessonTheory: React.FC<LessonTheoryTypes.Props> = ({
  concepts,
  className,
}) => (
  <section id="theory" className={`${styles.root} ${className ?? ""}`}>
    <LessonSectionHeading index={1} variant="lesson">
      Теория
    </LessonSectionHeading>
    <div className={styles.concepts}>
      {concepts.map((concept) => (
        <LessonTheoryConcept key={concept.id} concept={concept} />
      ))}
    </div>
  </section>
);
