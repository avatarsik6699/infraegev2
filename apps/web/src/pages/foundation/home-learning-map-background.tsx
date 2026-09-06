import { SvgPattern } from "~/shared/components/svg-pattern";
import styles from "./foundation-page.module.css";
import { homeLearningMapPatterns } from "./home-learning-map-patterns";

export const HomeLearningMapBackground: React.FC = () => (
  <>
    {Object.entries(homeLearningMapPatterns).map(([name, preset]) => (
      <SvgPattern.Preset
        key={name}
        {...preset}
        className={styles.backgroundPattern}
        contentClassName={styles.patternPreset}
        name={name}
      />
    ))}
  </>
);
