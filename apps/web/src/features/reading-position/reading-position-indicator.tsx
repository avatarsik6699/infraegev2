import { useEffect, useState } from "react";
import { observeReadingPosition } from "~/shared/lib/reading-position";
import type { ReadingPositionTypes } from "./reading-position.types";
import styles from "./reading-position-indicator.module.css";

export const ReadingPositionIndicator: React.FC<ReadingPositionTypes.Props> = (
  props,
) => {
  const [progress, setProgress] = useState(0);

  useEffect(
    function observeReadingPositionFx() {
      const target = props.targetRef.current;
      if (!target) return;
      return observeReadingPosition(target, setProgress);
    },
    [props.targetRef],
  );

  return (
    <span className={styles.track} aria-hidden="true" data-reading-position>
      <span
        className={styles.value}
        style={{ transform: `scaleX(${String(progress)})` }}
        data-reading-position-value
      />
    </span>
  );
};
