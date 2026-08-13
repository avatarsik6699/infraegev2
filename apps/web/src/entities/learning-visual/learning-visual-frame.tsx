import { useId } from "react";
import type { LearningVisualFrameTypes } from "./learning-visual-frame.types";
import styles from "./learning-visual-frame.module.css";

export const LearningVisualFrame: React.FC<LearningVisualFrameTypes.Props> = (
  props,
) => {
  const descriptionId = useId();

  return (
    <figure className={props.className} aria-describedby={descriptionId}>
      <figcaption className={styles.caption} data-visual-caption>
        <span>{props.caption}</span>
        <span className={styles.purpose}>{props.purpose}</span>
      </figcaption>
      {props.children}
      <div
        className={styles.alternative}
        id={descriptionId}
        data-visual-alternative
      >
        <strong>Текстовое описание схемы.</strong> {props.accessibleDescription}
      </div>
    </figure>
  );
};
