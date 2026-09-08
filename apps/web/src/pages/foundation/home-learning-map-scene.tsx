import styles from "./foundation-page.module.css";
import { HomeLearningMapBackground } from "./home-learning-map-background";
import { HomeLearningMapCards } from "./home-learning-map-cards";
import { HomeLearningMapConnections } from "./home-learning-map-connections";
import { HomeLearningMapPeripheralConnections } from "./home-learning-map-peripheral-connections";
import { HomeLearningMapStages } from "./home-learning-map-stages";

export const HomeLearningMapScene: React.FC = () => (
  <svg
    className={styles.mapScene}
    data-home-map-scene
    viewBox="-64 -24 1200 1540"
    fill="none"
    preserveAspectRatio="xMidYMin slice"
  >
    <defs>
      <pattern
        id="home-paper-texture"
        width="37"
        height="41"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M3 7h1m8 -4 .8 1m15 2h1m-20 12 1 -.6m13 -4h1m10 10 -1 1M4 33l1 .4m12 -6h1m7 10 1 -.6M34 38h1"
          stroke="var(--color-brand-ink)"
          strokeWidth="0.65"
          strokeLinecap="round"
        />
        <path
          d="M7 12h2m12 -4h1m9 12h2M11 35h2m7 -13h2"
          stroke="var(--color-surface)"
          strokeWidth="0.9"
        />
      </pattern>
      <linearGradient id="paper-surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-surface)" stopOpacity="0.98" />
        <stop
          offset="0.42"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.96"
        />
        <stop
          offset="0.78"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="1"
        />
        <stop
          offset="1"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="1"
        />
      </linearGradient>
      <filter id="stage-shadow" x="-15%" y="-30%" width="130%" height="170%">
        <feDropShadow
          dx="0.6"
          dy="2.5"
          stdDeviation="2.4"
          floodColor="var(--color-brand-ink)"
          floodOpacity="0.04"
        />
        <feDropShadow
          dx="1"
          dy="10"
          stdDeviation="8"
          floodColor="var(--color-brand-ink)"
          floodOpacity="0.085"
        />
      </filter>
      <linearGradient id="stage-surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-surface)" stopOpacity="0.88" />
        <stop
          offset="0.52"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.96"
        />
        <stop
          offset="1"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.54"
        />
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
          stopColor="var(--color-brand-muted)"
          stopOpacity="0.16"
        />
      </linearGradient>
      <linearGradient id="stage-highlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="var(--color-surface)" stopOpacity="0" />
        <stop
          offset="0.2"
          stopColor="var(--color-surface)"
          stopOpacity="0.82"
        />
        <stop
          offset="0.78"
          stopColor="var(--color-surface)"
          stopOpacity="0.45"
        />
        <stop offset="1" stopColor="var(--color-surface)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="active-stage-surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-surface)" stopOpacity="0.96" />
        <stop offset="0.54" stopColor="var(--color-brand-canvas)" />
        <stop
          offset="1"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="1"
        />
      </linearGradient>
      <radialGradient id="pattern-grid-relief">
        <stop
          offset="0"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.82"
        />
        <stop
          offset="0.58"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.56"
        />
        <stop
          offset="1"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0"
        />
      </radialGradient>
      <linearGradient id="motion-border-neutral" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-brand-ink)" stopOpacity="0" />
        <stop
          offset="0.3"
          stopColor="var(--color-brand-muted)"
          stopOpacity="0.28"
        />
        <stop
          offset="0.54"
          stopColor="var(--color-brand-ink)"
          stopOpacity="0.44"
        />
        <stop
          offset="0.72"
          stopColor="var(--color-surface)"
          stopOpacity="0.24"
        />
        <stop offset="1" stopColor="var(--color-brand-muted)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="motion-border-accent" x1="0" y1="0" x2="1" y2="1">
        <stop
          offset="0"
          stopColor="var(--color-brand-orange)"
          stopOpacity="0"
        />
        <stop
          offset="0.3"
          stopColor="var(--color-brand-orange)"
          stopOpacity="0.5"
        />
        <stop
          offset="0.52"
          stopColor="var(--color-brand-orange-soft)"
          stopOpacity="1"
        />
        <stop offset="0.7" stopColor="var(--color-surface)" stopOpacity="1" />
        <stop
          offset="0.86"
          stopColor="var(--color-brand-orange)"
          stopOpacity="0.78"
        />
        <stop
          offset="1"
          stopColor="var(--color-brand-orange)"
          stopOpacity="0"
        />
      </linearGradient>
    </defs>

    <g className={styles.mapBackdropPlane}>
      <HomeLearningMapBackground />
    </g>
    <g>
      <HomeLearningMapPeripheralConnections />
      <HomeLearningMapPeripheralConnections compact />
      <HomeLearningMapCards />
      <HomeLearningMapStages />
      <HomeLearningMapConnections />
      <HomeLearningMapConnections compact />
    </g>
  </svg>
);
