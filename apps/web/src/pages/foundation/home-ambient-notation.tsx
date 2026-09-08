import { SvgPattern } from "~/shared/components/svg-pattern";
import { homeLearningMapPatterns } from "./home-learning-map-patterns";
import styles from "./foundation-page.module.css";

type HomeAmbientNotationProps = {
  name: "algorithm" | "byte" | "traversal" | "logicPulse" | "powers";
};

export const HomeAmbientNotation: React.FC<HomeAmbientNotationProps> = (
  props,
) => {
  const preset = homeLearningMapPatterns[props.name];
  const bounds = preset.bounds;
  return (
    <svg
      className={styles.ambientNotation}
      data-ambient-notation={props.name}
      viewBox={`${String(bounds.x)} ${String(bounds.y)} ${String(bounds.width)} ${String(bounds.height)}`}
      fill="none"
    >
      <SvgPattern.Preset
        {...preset}
        contentClassName={styles.patternPreset}
        name={`page-${props.name}`}
      />
    </svg>
  );
};
