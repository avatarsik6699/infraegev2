import { SvgDrawing } from "~/shared/components/svg-drawing";
import type { SvgDrawingTypes } from "~/shared/components/svg-drawing";
import styles from "./foundation-page.module.css";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";

type PeripheralConnection = {
  controls: readonly [SvgDrawingTypes.Point, SvgDrawingTypes.Point];
  end: SvgDrawingTypes.Point;
  id: string;
  start: SvgDrawingTypes.Point;
  via?: {
    controls: readonly [SvgDrawingTypes.Point, SvgDrawingTypes.Point];
    end: SvgDrawingTypes.Point;
  };
};

type PeripheralConnectionProps = {
  connection: PeripheralConnection;
  kind: "card" | "cycle" | "pattern";
};

type ArrowHeadMetrics = {
  halfWidth: number;
  length: number;
};

const shaftFadeStops = [
  { offset: 0, opacity: 0 },
  { offset: 0.14, opacity: 0.24 },
  { offset: 0.38, opacity: 0.82 },
  { offset: 0.72, opacity: 0.92 },
  { offset: 1, opacity: 1 },
] as const;

const echoedConnectionIds = new Set([
  "theory-card",
  "practice-card",
  "practice-card-theory-loop",
  "statistics-card",
]);

const connectionClassNames = {
  card: styles.cardConnection,
  cycle: styles.cycleConnection,
  pattern: styles.patternConnection,
} as const;

const connectionMetrics = {
  card: { dashArray: "8 7", halfWidth: 4, length: 10, strokeWidth: 2.5 },
  cycle: { dashArray: "8 7", halfWidth: 4, length: 10, strokeWidth: 2.5 },
  pattern: { dashArray: "6 9", halfWidth: 3.1, length: 8, strokeWidth: 1.8 },
} as const;

const cubicPath = (
  connection: PeripheralConnection,
  finalEnd: SvgDrawingTypes.Point = connection.end,
) => {
  const firstEnd = connection.via?.end ?? finalEnd;
  const firstCurve = `M ${String(connection.start.x)} ${String(connection.start.y)} C ${String(connection.controls[0].x)} ${String(connection.controls[0].y)} ${String(connection.controls[1].x)} ${String(connection.controls[1].y)} ${String(firstEnd.x)} ${String(firstEnd.y)}`;

  if (!connection.via) return firstCurve;

  return `${firstCurve} C ${String(connection.via.controls[0].x)} ${String(connection.via.controls[0].y)} ${String(connection.via.controls[1].x)} ${String(connection.via.controls[1].y)} ${String(finalEnd.x)} ${String(finalEnd.y)}`;
};

const arrowDirection = (connection: PeripheralConnection) => {
  const previous = connection.via?.controls[1] ?? connection.controls[1];
  const dx = connection.end.x - previous.x;
  const dy = connection.end.y - previous.y;
  const magnitude = Math.hypot(dx, dy);
  return { x: dx / magnitude, y: dy / magnitude };
};

const shaftEnd = (
  connection: PeripheralConnection,
  metrics: ArrowHeadMetrics,
): SvgDrawingTypes.Point => {
  const direction = arrowDirection(connection);
  const inset = metrics.length - 1.2;
  return {
    x: connection.end.x - direction.x * inset,
    y: connection.end.y - direction.y * inset,
  };
};

const arrowHeadPath = (
  connection: PeripheralConnection,
  metrics: ArrowHeadMetrics,
): string => {
  const direction = arrowDirection(connection);
  const baseX = connection.end.x - direction.x * metrics.length;
  const baseY = connection.end.y - direction.y * metrics.length;
  const unitX = direction.x;
  const unitY = direction.y;
  const halfWidth = metrics.halfWidth;
  const sideX = -unitY * halfWidth;
  const sideY = unitX * halfWidth;

  return `M ${String(connection.end.x)} ${String(connection.end.y)} L ${String(baseX + sideX)} ${String(baseY + sideY)} L ${String(baseX - sideX)} ${String(baseY - sideY)} Z`;
};

const connectionEchoes = (
  connection: PeripheralConnection,
  d: string,
  dashArray: string,
  fade: SvgDrawingTypes.Fade,
  strokeWidth: number,
) => {
  if (!echoedConnectionIds.has(connection.id)) return undefined;

  return [
    {
      id: `${connection.id}-echo`,
      d,
      dashArray,
      fade,
      opacity: 0.13,
      pathLength: 100,
      scaleStroke: true,
      strokeWidth: strokeWidth + 1,
      transform: "translate(1.5 2)",
    },
  ];
};

const PeripheralConnectionArrow: React.FC<PeripheralConnectionProps> = ({
  connection,
  kind,
}) => {
  const metrics = connectionMetrics[kind];
  const headMetrics = {
    halfWidth: metrics.halfWidth,
    length: metrics.length,
  };
  const path = cubicPath(connection, shaftEnd(connection, headMetrics));
  const fade = {
    from: connection.start,
    to: connection.end,
    stops: shaftFadeStops,
  } as const;

  return (
    <g data-map-peripheral-connection={connection.id} data-target-kind={kind}>
      <SvgDrawing.Arrow
        className={connectionClassNames[kind]}
        echoes={connectionEchoes(
          connection,
          path,
          metrics.dashArray,
          fade,
          metrics.strokeWidth,
        )}
        shaft={{
          kind: "line",
          d: path,
          dashArray: metrics.dashArray,
          fade,
          pathLength: 100,
          scaleStroke: true,
          strokeWidth: metrics.strokeWidth,
        }}
        head={{
          d: arrowHeadPath(connection, headMetrics),
          kind: "filled",
        }}
      />
    </g>
  );
};

export const HomeLearningMapPeripheralConnections: React.FC = () => (
  <g data-map-peripheral-connections>
    {homeLearningMapGeometry.cardConnections.map((connection) => (
      <PeripheralConnectionArrow
        connection={connection}
        key={connection.id}
        kind="card"
      />
    ))}
    {homeLearningMapGeometry.cycleConnections.map((connection) => (
      <PeripheralConnectionArrow
        connection={connection}
        key={connection.id}
        kind="cycle"
      />
    ))}
    {homeLearningMapGeometry.patternConnections.map((connection) => (
      <PeripheralConnectionArrow
        connection={connection}
        key={connection.id}
        kind="pattern"
      />
    ))}
  </g>
);
