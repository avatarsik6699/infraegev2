import { HomeLearningMapCompletedStage } from "./home-learning-map-completed-stage";
import { HomeLearningMapStageSurface } from "./home-learning-map-stage-surface";
import styles from "./foundation-page.module.css";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";

export const HomeLearningMapStages: React.FC = () => {
  const stages = homeLearningMapGeometry.stages;

  return (
    <>
      <HomeLearningMapCompletedStage
        id="theory"
        number="01"
        stage={stages.theory}
        title="Теория"
      />
      <HomeLearningMapCompletedStage
        id="practice"
        number="02"
        stage={stages.practice}
        title="Практика"
      />

      <g
        className={`${styles.stage} ${styles.activeStage}`}
        data-map-node="tasks-stage"
        transform={`translate(${String(stages.tasks.x)} ${String(stages.tasks.y)})`}
        style={
          {
            "--compact-position": "translate(60px, 850px) scale(1.7)",
          } as React.CSSProperties
        }
      >
        <HomeLearningMapStageSurface
          active
          kind="tasks"
          width={stages.tasks.width}
          height={stages.tasks.height}
        />
        <text className={styles.stageNumber} data-stage-number x="20" y="62">
          03
        </text>
        <text className={styles.stageTitle} data-stage-title x="82" y="46">
          Задания
        </text>
        <text className={styles.stageDetail} x="82" y="75">
          Задание 16
        </text>
      </g>

      <g
        className={styles.progress}
        data-map-node="progress"
        transform={`translate(${String(stages.progress.x)} ${String(stages.progress.y)})`}
        style={
          {
            "--compact-position": "translate(660px, 1190px) scale(1.7)",
          } as React.CSSProperties
        }
      >
        <circle className={styles.progressSurface} cx="64" cy="64" r="64" />
        <circle className={styles.progressTrack} cx="64" cy="64" r="62.25" />
        <circle
          className={styles.progressArc}
          cx="64"
          cy="64"
          r="62.25"
          pathLength="100"
        />
        <circle
          className={styles.surfaceMotionBorder}
          data-home-motion="progress-border"
          cx="64"
          cy="64"
          r="62.25"
          pathLength="100"
        />
        <text
          className={styles.progressValue}
          x="64"
          y="64"
          dominantBaseline="central"
        >
          72%
        </text>
      </g>
    </>
  );
};
