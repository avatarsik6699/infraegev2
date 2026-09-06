import { SvgDrawing } from "~/shared/components/svg-drawing";
import styles from "./foundation-page.module.css";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";

const connectionFadeStops = [
  { color: "var(--color-brand-orange)", offset: 0, opacity: 1 },
  { color: "var(--color-brand-orange-soft)", offset: 0.4, opacity: 0.92 },
  { color: "#ffffff", offset: 0.56, opacity: 0.34 },
  { color: "var(--color-brand-orange)", offset: 1, opacity: 1 },
] as const;

const flowFadeStops = [
  { color: "var(--color-brand-orange)", offset: 0, opacity: 0 },
  { color: "var(--color-brand-orange)", offset: 0.3, opacity: 0.9 },
  { color: "#ffb080", offset: 0.54, opacity: 1 },
  { color: "var(--color-brand-orange)", offset: 0.78, opacity: 0.94 },
  { color: "var(--color-brand-orange)", offset: 1, opacity: 0 },
] as const;

const connectionPath = (
  connection: (typeof homeLearningMapGeometry.connections)[number],
) =>
  `M ${String(connection.start.x)} ${String(connection.start.y)} C ${String(connection.controls[0].x)} ${String(connection.controls[0].y)} ${String(connection.controls[1].x)} ${String(connection.controls[1].y)} ${String(connection.end.x)} ${String(connection.end.y)}`;

export const HomeLearningMapConnections: React.FC = () => (
  <g className={styles.mapConnections} data-map-connections>
    {homeLearningMapGeometry.connections.map((connection) => (
      <g data-map-connection={connection.id} key={connection.id}>
        <g data-connection-layer="base">
          <SvgDrawing.Line
            d={connectionPath(connection)}
            fade={{
              from: connection.start,
              to: connection.end,
              stops: connectionFadeStops,
            }}
            scaleStroke
            strokeWidth={2.9}
          />
        </g>
        <g data-connection-layer="flow" data-home-motion="connection-flow">
          <SvgDrawing.Line
            className={styles.connectionFlow}
            d={connectionPath(connection)}
            dashArray="28 72"
            fade={{
              from: connection.start,
              to: connection.end,
              stops: flowFadeStops,
            }}
            pathLength={100}
            scaleStroke
            strokeWidth={3.8}
          />
          <SvgDrawing.Line
            className={`${styles.connectionFlow} ${styles.connectionFlowSecondary}`}
            d={connectionPath(connection)}
            dashArray="12 88"
            fade={{
              from: connection.start,
              to: connection.end,
              stops: flowFadeStops,
            }}
            pathLength={100}
            scaleStroke
            strokeWidth={2.4}
          />
        </g>
      </g>
    ))}
  </g>
);
