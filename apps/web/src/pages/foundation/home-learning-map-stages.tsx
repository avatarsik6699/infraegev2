import { CustomIcon } from "~/shared/components/custom-icon";
import styles from "./foundation-page.module.css";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";

type StageSurfaceProps = {
  active?: boolean;
  height: number;
  width: number;
};

const StageSurface: React.FC<StageSurfaceProps> = ({
  active = false,
  height,
  width,
}) => (
  <>
    <rect
      className={styles.stageSurface}
      data-active={active || undefined}
      width={width}
      height={height}
      rx={active ? 27 : 28}
    />
    <path
      className={styles.stageHighlight}
      d={`M24 2.5 C${String(width * 0.34)} .8 ${String(width * 0.72)} 1.2 ${String(width - 24)} 3`}
    />
  </>
);

const stageTransform = (stage: { x: number; y: number }) =>
  `translate(${String(stage.x)} ${String(stage.y)})`;

type CompletedStageProps = {
  id: string;
  number: string;
  stage: { height: number; width: number; x: number; y: number };
  title: string;
};

const CompletedStage: React.FC<CompletedStageProps> = ({
  id,
  number,
  stage,
  title,
}) => (
  <g
    className={styles.stage}
    data-map-node={`${id}-stage`}
    transform={stageTransform(stage)}
  >
    <StageSurface width={stage.width} height={stage.height} />
    <text className={styles.stageNumber} data-stage-number x="26" y="48">
      {number}
    </text>
    <text className={styles.stageTitle} data-stage-title x="78" y="48">
      {title}
    </text>
    <CustomIcon.Check
      className={styles.stageCheck}
      data-stage-check
      x="188"
      y="23"
      width="32"
      height="32"
    />
  </g>
);

export const HomeLearningMapStages: React.FC = () => {
  const stages = homeLearningMapGeometry.stages;

  return (
    <>
      <CompletedStage
        id="theory"
        number="01"
        stage={stages.theory}
        title="Теория"
      />
      <CompletedStage
        id="practice"
        number="02"
        stage={stages.practice}
        title="Практика"
      />

      <g
        className={`${styles.stage} ${styles.activeStage}`}
        data-map-node="tasks-stage"
        transform={stageTransform(stages.tasks)}
      >
        <StageSurface
          active
          width={stages.tasks.width}
          height={stages.tasks.height}
        />
        <text className={styles.stageNumber} data-stage-number x="26" y="46">
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
        transform={stageTransform(stages.progress)}
      >
        <rect
          className={styles.progressSurface}
          width={stages.progress.width}
          height={stages.progress.height}
          rx="13"
        />
        <path
          className={styles.progressHighlight}
          d="M16 2.5C47 .8 96 1 126 3"
        />
        <text x="71" y="35">
          72% курса
        </text>
      </g>
    </>
  );
};
