import { CustomIcon } from "~/shared/components/custom-icon";
import styles from "./foundation-page.module.css";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";
import { HomeLearningMapStageSurface } from "./home-learning-map-stage-surface";

const stageTransform = (stage: { x: number; y: number }) =>
  `translate(${String(stage.x)} ${String(stage.y)})`;

type CompletedStageProps = {
  id: "theory" | "practice";
  number: string;
  stage: { height: number; width: number; x: number; y: number };
  title: string;
};

export const HomeLearningMapCompletedStage: React.FC<CompletedStageProps> = (
  props,
) => (
  <g
    className={styles.stage}
    data-map-node={`${props.id}-stage`}
    transform={stageTransform(props.stage)}
    style={
      {
        "--compact-position": `translate(${String(homeLearningMapGeometry.compact.stages[props.id].x)}px, ${String(homeLearningMapGeometry.compact.stages[props.id].y)}px) scale(1.7)`,
      } as React.CSSProperties
    }
  >
    <HomeLearningMapStageSurface
      kind={props.id}
      width={props.stage.width}
      height={props.stage.height}
    />
    <text className={styles.stageNumber} data-stage-number x="20" y="52">
      {props.number}
    </text>
    <text className={styles.stageTitle} data-stage-title x="82" y="48">
      {props.title}
    </text>
    <CustomIcon.Check
      className={styles.stageCheck}
      data-stage-check
      x="200"
      y="27"
      width="24"
      height="24"
    />
  </g>
);
