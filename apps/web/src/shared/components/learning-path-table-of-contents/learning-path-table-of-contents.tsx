import { TableOfContents } from "@mantine/core";
import type { LearningPathTableOfContentsTypes } from "./learning-path-table-of-contents.types";
import styles from "./learning-path-table-of-contents.module.css";

const TRACK_WIDTH = 70;
const TRACK_HEIGHT = 60;
const NODE_GAP = 11;
const NODE_POSITIONS = [18, 52, 52, 18] as const;

export const LearningPathTableOfContents: React.FC<
  LearningPathTableOfContentsTypes.Props
> = ({ items, targetSelector, offset = 112 }) => {
  return (
    <TableOfContents
      classNames={{ root: styles.root, control: styles.control }}
      initialData={items.map((item) => ({
        id: item.id,
        value: item.label,
        depth: 2,
      }))}
      scrollSpyOptions={{
        selector: targetSelector,
        offset,
        getDepth: () => 2,
        getValue: (element) =>
          element.getAttribute("data-learning-label") ?? "",
      }}
      getControlProps={({ active, data }) => {
        const index = items.findIndex((item) => item.id === data.id);
        const item = items[index];
        const nodeX = nodePosition(index);
        const previousNodeX = nodePosition(index - 1);

        return {
          component: "a",
          href: `#${data.id}`,
          "aria-current": active ? "location" : undefined,
          children: (
            <>
              <span className={styles.track} aria-hidden="true">
                {index > 0 && (
                  <svg
                    className={styles.connector}
                    viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_HEIGHT}`}
                    preserveAspectRatio="none"
                    focusable="false"
                  >
                    <path
                      className={styles.connectorPath}
                      d={connectorPath(previousNodeX, nodeX)}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}
                <svg
                  className={styles.node}
                  style={{ left: nodeX }}
                  viewBox="0 0 28 28"
                  focusable="false"
                  data-learning-path-node
                >
                  <circle className={styles.nodeCore} cx="14" cy="14" r="6" />
                </svg>
              </span>
              <span className={styles.copy} style={{ marginLeft: nodeX + 19 }}>
                <span className={styles.label}>{data.value}</span>
                <span className={styles.description} aria-hidden="true">
                  {item?.description}
                </span>
              </span>
            </>
          ),
        };
      }}
      unstyled
    />
  );
};

function nodePosition(index: number): number {
  if (index < 0) return NODE_POSITIONS[0];
  return NODE_POSITIONS[index % NODE_POSITIONS.length];
}

function connectorPath(fromX: number, toX: number): string {
  const startY = NODE_GAP;
  const endY = TRACK_HEIGHT - NODE_GAP;

  if (fromX === toX) return `M ${fromX} ${startY} V ${endY}`;

  const direction = Math.sign(toX - fromX);
  const curve = 8;
  const middleY = TRACK_HEIGHT / 2;

  return [
    `M ${fromX} ${startY}`,
    `V ${middleY - curve}`,
    `Q ${fromX} ${middleY} ${fromX + direction * curve} ${middleY}`,
    `H ${toX - direction * curve}`,
    `Q ${toX} ${middleY} ${toX} ${middleY + curve}`,
    `V ${endY}`,
  ].join(" ");
}
