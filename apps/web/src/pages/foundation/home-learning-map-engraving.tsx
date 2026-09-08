import { SvgPattern } from "~/shared/components/svg-pattern";
import { homeLearningMapMaterial } from "./home-learning-map-material";
import styles from "./foundation-page.module.css";

type HomeLearningMapEngravingProps = {
  width: number;
  height: number;
  stage?: boolean;
  kind: "theory" | "practice" | "tasks" | "statistics";
};

export const HomeLearningMapEngraving: React.FC<
  HomeLearningMapEngravingProps
> = (props) => (
  <g
    className={styles.surfaceEngraving}
    data-surface-engraving={props.kind}
    data-stage={props.stage || undefined}
  >
    <SvgPattern.Preset
      {...homeLearningMapMaterial.create(
        props.kind,
        props.width,
        props.height,
        props.stage,
      )}
      contentClassName={styles.materialPattern}
      name={`material-${props.kind}`}
    />
  </g>
);
