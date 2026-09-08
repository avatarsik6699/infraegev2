import { cssUtils } from "~/shared/lib/css-utils";
import { HomeLearningMapEngraving } from "./home-learning-map-engraving";
import styles from "./foundation-page.module.css";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";
import type { HomeLearningMapCardData } from "./home-learning-map-card.types";

export const HomeLearningMapCard: React.FC<{
  card: HomeLearningMapCardData;
}> = (props) => {
  const Icon = props.card.icon;

  const motion = homeLearningMapGeometry.cardMotion[props.card.id];
  const compact = homeLearningMapGeometry.compact.cards[props.card.id];

  return (
    <g
      className={styles.cardDrift}
      style={
        {
          "--card-lift": `-${String(motion.lift)}px`,
          "--depth-delay": `${String(motion.delay)}s`,
        } as React.CSSProperties
      }
    >
      <g
        className={cssUtils.cx(
          styles.paperCard,
          props.card.future && styles.futurePaperCard,
        )}
        data-home-map-card={props.card.id}
        transform={props.card.transform}
        style={
          {
            "--compact-position": `translate(${String(compact.x)}px, ${String(compact.y)}px) scale(${String(compact.scale)}) rotate(${String(props.card.id === "practice" ? 4 : -3)}deg)`,
          } as React.CSSProperties
        }
      >
        <g data-card-plane>
          <rect
            className={styles.cardSurface}
            data-card-surface
            width={props.card.width}
            height={props.card.height}
            rx="12"
          />
          <rect
            className={styles.surfaceTexture}
            width={props.card.width}
            height={props.card.height}
            rx="12"
          />
          <HomeLearningMapEngraving
            kind={props.card.id}
            width={props.card.width}
            height={props.card.height}
          />
          <rect
            className={styles.surfaceMotionBorder}
            data-home-motion="card-border"
            width={props.card.width}
            height={props.card.height}
            pathLength="100"
            rx="12"
          />
          <Icon
            className={styles.cardIcon}
            x={12}
            y={(props.card.height - 88) / 2}
            width={88}
            height={88}
          />
          <text
            className={styles.cardTitle}
            x="112"
            y={props.card.height / 2 - 5}
          >
            {props.card.title}
          </text>
          <text
            className={styles.cardCaption}
            data-card-caption
            x="112"
            y={props.card.height / 2 + 21}
          >
            {props.card.caption}
          </text>
        </g>
      </g>
    </g>
  );
};
