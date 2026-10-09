import { useState } from "react";
import { Button } from "~/shared/components/button";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import mediaStyles from "../lesson-media/lesson-media.module.css";
import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";
import { back, startState, statusText, step } from "./path-rules";
import styles from "./path-builder.module.css";

type Props = Omit<LessonMediaTypes.Graph, "kind"> & {
  caption: React.ReactNode;
};

const INK = "var(--color-text)";
const MUTED = "var(--color-muted)";
const ACCENT = "var(--color-brand-orange)";
const NODE_R = 17;

/** The current end of the path is drawn thickest, the rest of it accented. */
function nodeStroke(isLast: boolean, inPath: boolean): number {
  if (isLast) return 3;
  return inPath ? 2.4 : 1.5;
}

/**
 * Graph sandbox (Change 172): the learner builds a path by activating
 * vertices in turn. A move against an arrow is refused with the reason, the
 * running length is announced, the finished path is compared with the
 * shortest. Geometry comes from the generated manifest (`figures.graph_layout`).
 * Without scripting the same graph is shown as a static picture.
 */
export const PathBuilder: React.FC<Props> = (props) => {
  const enhanced = useIsEnhanced();
  const [state, setState] = useState(() => startState(props));
  const onPath = new Set(
    state.path.slice(1).map((v, i) => `${String(state.path[i])}-${String(v)}`),
  );
  const last = state.path[state.path.length - 1];
  const label = `Граф: ${props.edges.map((e) => `${String(e.from)} → ${String(e.to)} (${e.weight})`).join(", ")}`;

  return (
    <figure className={mediaStyles.figure} data-path-builder>
      <div className={mediaStyles.plate} tabIndex={enhanced ? undefined : 0}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${String(props.width)} ${String(props.height)}`}
          role={enhanced ? "group" : "img"}
          aria-label={label}
        >
          {props.edges.map((e) => {
            const hot =
              enhanced && onPath.has(`${String(e.from)}-${String(e.to)}`);
            const color = hot ? ACCENT : INK;
            return (
              <g key={`${String(e.from)}-${String(e.to)}`}>
                <path
                  d={e.path}
                  fill="none"
                  stroke={color}
                  strokeWidth={hot ? 2.4 : 1.4}
                />
                <path d={e.arrow} fill={color} />
              </g>
            );
          })}
          {props.edges.map((e) => {
            if (!e.label) return null;
            const hot =
              enhanced && onPath.has(`${String(e.from)}-${String(e.to)}`);
            return (
              <g key={`label-${String(e.from)}-${String(e.to)}`}>
                <rect
                  x={e.label.x - e.label.width / 2}
                  y={e.label.y - 10}
                  width={e.label.width}
                  height={20}
                  rx={4}
                  fill="var(--color-surface)"
                />
                <text
                  x={e.label.x}
                  y={e.label.y + 5}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={hot ? 600 : 400}
                  fill={hot ? ACCENT : MUTED}
                >
                  {e.weight}
                </text>
              </g>
            );
          })}
          {props.nodes.map((n) => {
            const inPath = enhanced && state.path.includes(n.id);
            const circle = (
              <>
                {enhanced ? (
                  // a larger, invisible target for a finger on a phone
                  <circle
                    className={styles.hit}
                    cx={n.x}
                    cy={n.y}
                    r={NODE_R + 9}
                    fill="transparent"
                  />
                ) : null}
                <circle
                  className={styles.node}
                  cx={n.x}
                  cy={n.y}
                  r={NODE_R}
                  fill="var(--color-surface)"
                  stroke={inPath ? ACCENT : INK}
                  strokeWidth={nodeStroke(enhanced && n.id === last, inPath)}
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fontSize={String(n.id).length < 4 ? 14 : 12}
                  fontWeight={600}
                  fill={INK}
                >
                  {n.id}
                </text>
              </>
            );
            if (!enhanced) return <g key={n.id}>{circle}</g>;
            const activate = () => setState((s) => step(props, s, n.id));
            return (
              <g
                key={n.id}
                className={styles.vertex}
                role="button"
                tabIndex={0}
                aria-label={`Вершина ${String(n.id)}`}
                onClick={activate}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    activate();
                  }
                }}
              >
                {circle}
              </g>
            );
          })}
        </svg>
      </div>
      {enhanced ? (
        <div className={styles.controls}>
          <p className={styles.status} aria-live="polite">
            {statusText(props, state)}
          </p>
          <span className={styles.buttons}>
            <Button
              type="button"
              hierarchy="secondary"
              density="compact"
              onClick={() => setState((s) => back(props, s))}
            >
              Шаг назад
            </Button>
            <Button
              type="button"
              hierarchy="secondary"
              density="compact"
              onClick={() => setState(startState(props))}
            >
              Сначала
            </Button>
          </span>
        </div>
      ) : null}
      <figcaption className={mediaStyles.caption}>{props.caption}</figcaption>
    </figure>
  );
};
