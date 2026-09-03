import { useEffect, useMemo, useRef, useState } from "react";
import { Image } from "~/shared/components/image";
import { Typography } from "~/shared/components/typography";
import { observeDiagramGeometry } from "./lib/browser-adapter";
import {
  buildDiagramLeaderPaths,
  type DiagramGeometry,
} from "./lib/diagram-geometry";
import styles from "./diagram.module.css";

type DiagramPointer = {
  id: string;
  /** Position of the marker on the image, in percent of its box (0-100). */
  x: number;
  y: number;
  /** Which side the note renders on. Defaults to the side the marker sits
   * closest to (x < 50 → left). */
  side?: "left" | "right";
  note: React.ReactNode;
};

type DiagramFootnote = {
  id: string;
  text: React.ReactNode;
};

type DiagramPlacement = "figure" | "annotated" | "float-left" | "float-right";

type Props = {
  src: string;
  alt: string;
  caption: string;
  purpose: string;
  /** Dense, sits directly under the image regardless of placement — keep
   * it short. A concept that needs a real explanation belongs in the
   * surrounding prose next to a float-left/float-right Diagram, at normal
   * reading size, not crammed in here. */
  description?: React.ReactNode;
  /** Only rendered with placement="annotated" — plain dot markers on the
   * image, connected by leader lines to plain notes in the side gutters. */
  pointers?: readonly DiagramPointer[];
  footnotes?: readonly DiagramFootnote[];
  placement?: DiagramPlacement;
};

const placementClass: Record<DiagramPlacement, string> = {
  figure: styles.figure,
  annotated: styles.annotated,
  "float-left": styles.floatLeft,
  "float-right": styles.floatRight,
};

const resolveSide = (pointer: DiagramPointer): "left" | "right" =>
  pointer.side ?? (pointer.x < 50 ? "left" : "right");

export const Diagram: React.FC<Props> = (props) => {
  const placement = props.placement ?? "figure";
  const annotated = placement === "annotated";
  const pointers = annotated ? (props.pointers ?? []) : [];
  const footnotes = props.footnotes ?? [];
  const leftPointers = pointers.filter((p) => resolveSide(p) === "left");
  const rightPointers = pointers.filter((p) => resolveSide(p) === "right");

  const layoutRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<DiagramGeometry>();
  const leaderPaths = useMemo(
    () => (geometry ? buildDiagramLeaderPaths(geometry) : []),
    [geometry],
  );

  useEffect(
    function observeDiagramGeometryFx() {
      if (!annotated) return;
      const root = layoutRef.current;
      if (!root) return;
      return observeDiagramGeometry(root, setGeometry);
    },
    [annotated, pointers.length],
  );

  const image = (
    <div className={styles.frame}>
      <Image src={props.src} alt={props.alt} className={styles.image} />
      {pointers.map((pointer) => (
        <span
          key={pointer.id}
          className={styles.marker}
          data-diagram-marker={pointer.id}
          style={{
            left: `${String(pointer.x)}%`,
            top: `${String(pointer.y)}%`,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );

  const meta = (
    <div className={styles.meta}>
      <Typography.Text component="div" variant="caption">
        {props.caption}
      </Typography.Text>
      <Typography.Text component="div" variant="caption" tone="muted">
        {props.purpose}
      </Typography.Text>
      {props.description ? (
        <Typography.Text component="div" variant="caption" tone="muted">
          {props.description}
        </Typography.Text>
      ) : null}
      {footnotes.map((footnote) => (
        <Typography.Text
          key={footnote.id}
          component="div"
          variant="caption"
          tone="muted"
        >
          {footnote.text}
        </Typography.Text>
      ))}
    </div>
  );

  if (!annotated) {
    return (
      <figure
        className={`${styles.root} ${placementClass[placement]}`}
        data-learning-block
      >
        {image}
        <figcaption>{meta}</figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={`${styles.root} ${placementClass[placement]}`}
      data-learning-block
    >
      <div className={styles.annotatedLayout} ref={layoutRef}>
        <div className={styles.gutter} data-side="left">
          {leftPointers.map((pointer) => (
            <Typography.Text
              key={pointer.id}
              component="div"
              variant="interface"
              tone="muted"
              className={styles.note}
              data-diagram-note={pointer.id}
              data-diagram-note-side="left"
            >
              {pointer.note}
            </Typography.Text>
          ))}
        </div>

        {image}

        <div className={styles.gutter} data-side="right">
          {rightPointers.map((pointer) => (
            <Typography.Text
              key={pointer.id}
              component="div"
              variant="interface"
              tone="muted"
              className={styles.note}
              data-diagram-note={pointer.id}
              data-diagram-note-side="right"
            >
              {pointer.note}
            </Typography.Text>
          ))}
        </div>

        {geometry ? (
          <svg
            className={styles.leaders}
            viewBox={`0 0 ${String(geometry.width)} ${String(geometry.height)}`}
            focusable="false"
            aria-hidden="true"
          >
            {leaderPaths.map((path) => (
              <path key={path.id} d={path.d} />
            ))}
          </svg>
        ) : null}
      </div>
      <figcaption>{meta}</figcaption>
    </figure>
  );
};
