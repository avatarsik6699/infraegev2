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
    viewBox="-24 0 1064 720"
    fill="none"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <filter id="paper-shadow" x="-20%" y="-30%" width="140%" height="170%">
        <feDropShadow
          dx="0.8"
          dy="3"
          stdDeviation="2.8"
          floodColor="#1a1a1a"
          floodOpacity="0.055"
        />
        <feDropShadow
          dx="1.5"
          dy="10"
          stdDeviation="11"
          floodColor="#1a1a1a"
          floodOpacity="0.075"
        />
      </filter>
      <linearGradient id="paper-surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.98" />
        <stop
          offset="0.42"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.96"
        />
        <stop offset="0.78" stopColor="#f1ece6" stopOpacity="0.72" />
        <stop offset="1" stopColor="#e9e3dc" stopOpacity="0.76" />
      </linearGradient>
      <linearGradient id="paper-border" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.82" />
        <stop
          offset="0.28"
          stopColor="var(--color-brand-ink)"
          stopOpacity="0.16"
        />
        <stop
          offset="1"
          stopColor="var(--color-brand-muted)"
          stopOpacity="0.2"
        />
      </linearGradient>
      <linearGradient id="paper-highlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.24" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="0.76" stopColor="#ffffff" stopOpacity="0.52" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id="stage-shadow" x="-15%" y="-30%" width="130%" height="170%">
        <feDropShadow
          dx="0.6"
          dy="2.5"
          stdDeviation="2.4"
          floodColor="#1a1a1a"
          floodOpacity="0.04"
        />
        <feDropShadow
          dx="1"
          dy="7"
          stdDeviation="8"
          floodColor="#1a1a1a"
          floodOpacity="0.055"
        />
      </filter>
      <linearGradient id="stage-surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.88" />
        <stop
          offset="0.52"
          stopColor="var(--color-brand-canvas)"
          stopOpacity="0.96"
        />
        <stop offset="1" stopColor="#e9e3dc" stopOpacity="0.54" />
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
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.2" stopColor="#ffffff" stopOpacity="0.82" />
        <stop offset="0.78" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="active-stage-surface" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.96" />
        <stop offset="0.54" stopColor="var(--color-brand-canvas)" />
        <stop offset="1" stopColor="#ebe5de" stopOpacity="0.72" />
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
        <stop offset="0.72" stopColor="#ffffff" stopOpacity="0.24" />
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
        <stop offset="0.52" stopColor="#ffb080" stopOpacity="1" />
        <stop offset="0.7" stopColor="#fff1e8" stopOpacity="0.72" />
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

    <HomeLearningMapBackground />
    <HomeLearningMapPeripheralConnections />
    <HomeLearningMapCards />
    <HomeLearningMapStages />
    <HomeLearningMapConnections />
  </svg>
);
