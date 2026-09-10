import { StatusSceneCard } from "./status-scene-card";
import styles from "./status-scene.module.css";

export const StatusSceneArtwork: React.FC = () => (
  <div className={styles.artwork} aria-hidden="true">
    <StatusSceneCard kind="theory" label="Теория" />
    <StatusSceneCard kind="practice" label="Практика" />
    <StatusSceneCard kind="tasks" label="Задания" />
    <StatusSceneCard kind="statistics" label="Статистика" />
    <svg
      className={styles.connection}
      viewBox="0 0 600 520"
      fill="none"
      focusable="false"
    >
      <path
        className={styles.accent}
        d="M310 25c45 70-55 85-10 150m0 170c-45 65 50 105 0 150"
        strokeDasharray="5 9"
      />
      <path d="M290 258l20 24m0-24-20 24" />
    </svg>
  </div>
);
