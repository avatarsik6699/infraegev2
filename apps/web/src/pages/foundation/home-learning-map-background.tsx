import { SvgPattern } from "~/shared/components/svg-pattern";
import styles from "./foundation-page.module.css";
import { homeLearningMapPatterns } from "./home-learning-map-patterns";

export const HomeLearningMapBackground: React.FC = () => (
  <g data-map-background-patterns>
    <g data-pattern-grid-relief>
      <ellipse
        cx="92"
        cy="140"
        rx="155"
        ry="128"
        fill="url(#pattern-grid-relief)"
      />
      <ellipse
        cx="622"
        cy="76"
        rx="112"
        ry="72"
        fill="url(#pattern-grid-relief)"
      />
      <ellipse
        cx="112"
        cy="348"
        rx="180"
        ry="104"
        fill="url(#pattern-grid-relief)"
      />
      <ellipse
        cx="940"
        cy="112"
        rx="126"
        ry="126"
        fill="url(#pattern-grid-relief)"
      />
      <ellipse
        cx="940"
        cy="390"
        rx="120"
        ry="126"
        fill="url(#pattern-grid-relief)"
      />
      <ellipse
        cx="904"
        cy="660"
        rx="142"
        ry="70"
        fill="url(#pattern-grid-relief)"
      />
      <ellipse
        cx="142"
        cy="658"
        rx="190"
        ry="86"
        fill="url(#pattern-grid-relief)"
      />
    </g>
    {Object.entries(homeLearningMapPatterns).map(([name, preset]) => (
      <SvgPattern.Preset
        key={name}
        {...preset}
        className={styles.backgroundPattern}
        contentClassName={styles.patternPreset}
        name={name}
      />
    ))}
  </g>
);
