import { SvgDrawing } from "~/shared/components/svg-drawing";
import styles from "./foundation-page.module.css";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";

const connectionFadeStops = [
  { offset: 0, opacity: 1 },
  { offset: 0.18, opacity: 0.9 },
  { offset: 0.45, opacity: 0.78 },
  { offset: 0.62, opacity: 0.92 },
  { offset: 1, opacity: 1 },
] as const;

export const HomeLearningMapConnections: React.FC = () => (
  <g className={styles.mapConnections} data-map-connections>
    {homeLearningMapGeometry.connections.map((connection) => (
      <g data-map-connection={connection.id} key={connection.id}>
        <SvgDrawing.Line
          d={`M ${String(connection.start.x)} ${String(connection.start.y)} C ${String(connection.controls[0].x)} ${String(connection.controls[0].y)} ${String(connection.controls[1].x)} ${String(connection.controls[1].y)} ${String(connection.end.x)} ${String(connection.end.y)}`}
          fade={{
            from: connection.start,
            to: connection.end,
            stops: connectionFadeStops,
          }}
          scaleStroke
          strokeWidth={2.9}
        />
      </g>
    ))}
  </g>
);
