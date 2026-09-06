import styles from "./foundation-page.module.css";
import { HomeLearningMapBackground } from "./home-learning-map-background";
import { HomeLearningMapCards } from "./home-learning-map-cards";
import { HomeLearningMapStages } from "./home-learning-map-stages";

export const HomeLearningMapScene: React.FC = () => (
  <svg
    className={styles.mapScene}
    data-home-map-scene
    viewBox="-24 0 1064 720"
    fill="none"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <filter id="paper-shadow" x="-20%" y="-30%" width="140%" height="170%">
        <feDropShadow
          dx="0"
          dy="6"
          stdDeviation="7"
          floodColor="#1a1a1a"
          floodOpacity="0.07"
        />
      </filter>
      <linearGradient id="paper-surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
        <stop
          offset="0.56"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.98"
        />
        <stop offset="1" stopColor="#eee9e4" stopOpacity="0.72" />
      </linearGradient>
      <linearGradient id="paper-border" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-brand-ink)" stopOpacity="0.2" />
        <stop
          offset="0.54"
          stopColor="var(--color-brand-ink)"
          stopOpacity="0.07"
        />
        <stop
          offset="1"
          stopColor="var(--color-brand-orange)"
          stopOpacity="0.16"
        />
      </linearGradient>
      <linearGradient id="paper-highlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.24" stopColor="#ffffff" stopOpacity="0.76" />
        <stop offset="0.76" stopColor="#ffffff" stopOpacity="0.38" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id="stage-shadow" x="-15%" y="-30%" width="130%" height="170%">
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="6"
          floodColor="#1a1a1a"
          floodOpacity="0.045"
        />
      </filter>
      <linearGradient id="stage-surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.68" />
        <stop
          offset="0.58"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.94"
        />
        <stop offset="1" stopColor="#eee9e4" stopOpacity="0.42" />
      </linearGradient>
      <linearGradient id="stage-border" x1="0" y1="0" x2="1" y2="1">
        <stop
          offset="0"
          stopColor="var(--color-brand-ink)"
          stopOpacity="0.24"
        />
        <stop
          offset="0.62"
          stopColor="var(--color-brand-ink)"
          stopOpacity="0.1"
        />
        <stop
          offset="1"
          stopColor="var(--color-brand-orange)"
          stopOpacity="0.13"
        />
      </linearGradient>
      <linearGradient id="stage-highlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.2" stopColor="#ffffff" stopOpacity="0.68" />
        <stop offset="0.78" stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>

    <HomeLearningMapBackground />
    <HomeLearningMapCards />
    <HomeLearningMapStages />
  </svg>
);
