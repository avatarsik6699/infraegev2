import { HomeLearningMapPeripheralArrow } from "./home-learning-map-peripheral-arrow";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";

export const HomeLearningMapPeripheralConnections: React.FC<{
  compact?: boolean;
}> = (props) => (
  <g
    data-map-peripheral-connections
    data-map-layout={props.compact ? "compact" : "wide"}
  >
    {(props.compact
      ? homeLearningMapGeometry.compact.cardConnections
      : homeLearningMapGeometry.cardConnections
    ).map((connection) => (
      <HomeLearningMapPeripheralArrow
        connection={connection}
        key={connection.id}
        kind="card"
      />
    ))}
    {(props.compact
      ? homeLearningMapGeometry.compact.cycleConnections
      : homeLearningMapGeometry.cycleConnections
    ).map((connection) => (
      <HomeLearningMapPeripheralArrow
        connection={connection}
        key={connection.id}
        kind="cycle"
      />
    ))}
    {(props.compact ? [] : homeLearningMapGeometry.patternConnections).map(
      (connection) => (
        <HomeLearningMapPeripheralArrow
          connection={connection}
          key={connection.id}
          kind="pattern"
        />
      ),
    )}
  </g>
);
