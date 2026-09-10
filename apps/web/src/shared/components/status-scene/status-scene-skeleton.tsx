import { StatusSceneCard } from "./status-scene-card";
import styles from "./status-scene.module.css";

export const StatusSceneSkeleton: React.FC = () => (
  <div className={styles.skeletonScene} aria-hidden="true" aria-busy="true">
    <div className={styles.skeletonOutline}>
      {Array.from({ length: 6 }, (_, index) => (
        <div className={styles.outlineGroup} key={index}>
          <i />
          <span />
          <span />
        </div>
      ))}
    </div>
    <div className={styles.skeletonArticle}>
      <div className={styles.skeletonHeading}>
        <span />
        <span />
      </div>
      <div className={styles.skeletonParagraph}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
    <div className={styles.skeletonNotation}>
      <StatusSceneCard kind="theory" label="Теория" />
      <StatusSceneCard kind="practice" label="Практика" />
    </div>
    <div className={styles.skeletonFormula}>
      <span>∑</span>
      <i />
      <i />
    </div>
    <div className={styles.skeletonTable}>
      {Array.from({ length: 12 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
    <div className={styles.skeletonCode}>
      {Array.from({ length: 9 }, (_, index) => (
        <div key={index}>
          <b>{index + 1}</b>
          <span />
        </div>
      ))}
    </div>
    <div className={styles.skeletonAside}>
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);
