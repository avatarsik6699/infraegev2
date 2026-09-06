import { SvgPattern } from "~/shared/components/svg-pattern";
import styles from "./foundation-page.module.css";
import { homeAmbientPatterns } from "./home-ambient-patterns";

export const HomeAmbientField: React.FC = () => (
  <div className={styles.ambientField} aria-hidden="true" data-home-ambient>
    <svg
      className={styles.ambientScene}
      viewBox="0 0 1600 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="ambient-orange-light">
          <stop offset="0" stopColor="var(--color-brand-orange-soft)" />
          <stop
            offset="0.44"
            stopColor="var(--color-brand-orange-soft)"
            stopOpacity="0.32"
          />
          <stop
            offset="1"
            stopColor="var(--color-brand-canvas)"
            stopOpacity="0"
          />
        </radialGradient>
        <radialGradient id="ambient-paper-light">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.66" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        className={styles.ambientLight}
        cx="1120"
        cy="430"
        rx="430"
        ry="360"
        fill="url(#ambient-orange-light)"
      />
      <ellipse
        className={styles.ambientPaperLight}
        cx="420"
        cy="360"
        rx="410"
        ry="310"
        fill="url(#ambient-paper-light)"
      />

      <SvgPattern.Preset
        {...homeAmbientPatterns.engineeringGrid}
        className={`${styles.ambientInkPattern} ${styles.ambientGridPattern}`}
        contentClassName={styles.ambientPatternContent}
        name="ambient-engineering-grid"
      />
      <SvgPattern.Preset
        {...homeAmbientPatterns.calibration}
        className={styles.ambientInkPattern}
        contentClassName={styles.ambientPatternContent}
        name="ambient-calibration"
      />
      <SvgPattern.Preset
        {...homeAmbientPatterns.notation}
        className={styles.ambientInkPattern}
        contentClassName={styles.ambientPatternContent}
        name="ambient-notation"
      />
    </svg>
  </div>
);
