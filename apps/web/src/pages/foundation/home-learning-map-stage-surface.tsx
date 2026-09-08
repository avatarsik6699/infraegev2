import { HomeLearningMapEngraving } from "./home-learning-map-engraving";
import styles from "./foundation-page.module.css";

type StageSurfaceProps = {
  active?: boolean;
  kind: "theory" | "practice" | "tasks";
  height: number;
  width: number;
};

export const HomeLearningMapStageSurface: React.FC<StageSurfaceProps> = (
  props,
) => (
  <>
    <rect
      className={styles.stageSurface}
      data-active={props.active || undefined}
      width={props.width}
      height={props.height}
      rx={props.active ? 27 : 28}
    />
    <rect
      className={styles.surfaceTexture}
      width={props.width}
      height={props.height}
      rx={props.active ? 27 : 28}
    />
    <HomeLearningMapEngraving
      kind={props.kind}
      stage
      width={props.width}
      height={props.height}
    />
    <rect
      className={styles.surfaceMotionBorder}
      data-home-motion="stage-border"
      width={props.width}
      height={props.height}
      pathLength="100"
      rx={props.active ? 27 : 28}
    />
    <path
      className={styles.stageHighlight}
      d={`M24 2.5 C${String(props.width * 0.34)} .8 ${String(props.width * 0.72)} 1.2 ${String(props.width - 24)} 3`}
    />
  </>
);
