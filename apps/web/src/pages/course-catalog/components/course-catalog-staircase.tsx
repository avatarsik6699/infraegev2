import { useRef, useState } from "react";
import { useElementActivity } from "~/shared/lib/element-activity";
import { Image, type ImageTypes } from "~/shared/components/image";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import styles from "../course-catalog-page.module.css";

const staircase = {
  route:
    "M65 825C160 830 195 786 282 779S421 774 464 713S514 612 575 583S671 558 725 510S774 429 847 409S968 393 996 339S1050 294 1104 270S1169 227 1219 208S1317 189 1344 146S1394 108 1425 67",
  nodes: [
    { x: 282, y: 779 },
    { x: 575, y: 583 },
    { x: 847, y: 409 },
    { x: 1104, y: 270 },
    { x: 1344, y: 146 },
  ],
};

type Props = { continuation?: boolean };

export const CourseCatalogStaircase: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useElementActivity(ref);
  const [status, setStatus] = useState<ImageTypes.Status>("loading");
  return (
    <div
      className={
        props.continuation ? styles.staircaseContinuation : styles.staircase
      }
      ref={ref}
      data-motion-active={(visible && status === "loaded") || undefined}
      aria-hidden="true"
      data-course-staircase={props.continuation ? undefined : true}
      data-course-staircase-continuation={props.continuation || undefined}
    >
      <Image
        src="/images/course-catalog/staircase.webp"
        srcSet="/images/course-catalog/responsive/staircase-480.webp 480w, /images/course-catalog/responsive/staircase-960.webp 960w, /images/course-catalog/responsive/staircase-1536.webp 1536w"
        sizes="(max-width: 44rem) 50vw, 60vw"
        fetchPriority="low"
        onStatusChange={setStatus}
        width={1536}
        height={1024}
        decorative
        className={styles.staircaseImage}
      />
      <svg
        className={styles.staircaseRoute}
        viewBox="0 0 1536 1024"
        fill="none"
      >
        <SvgDrawing.Line
          d={staircase.route}
          strokeWidth={1.4}
          className={styles.routeUnderlay}
        />
        <SvgDrawing.Line
          d={staircase.route}
          strokeWidth={1.8}
          pathLength={100}
          dashArray="100"
          className={
            props.continuation ? styles.routeUnderlay : styles.routeDraw
          }
        />
        <SvgDrawing.Line
          d={staircase.route}
          strokeWidth={3}
          pathLength={100}
          dashArray="3 97"
          className={
            props.continuation ? styles.continuationMarker : styles.routeMarker
          }
        />
        <g className={styles.routeNodes}>
          {staircase.nodes.map((node) => (
            <circle key={node.x} cx={node.x} cy={node.y} r={8} />
          ))}
        </g>
      </svg>
    </div>
  );
};
