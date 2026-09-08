import { useId, useRef } from "react";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { useCourseOverviewMotion } from "../model/use-course-overview-motion";
import styles from "../course-overview-page.module.css";

const overviewField = {
  route: "M75 45C-30 90 10 260 180 295S430 230 470 300C510 340 520 240 540 185",
};

export const CourseOverviewField: React.FC = () => {
  const patternId = useId();
  const fieldRef = useRef<HTMLDivElement>(null);
  const active = useCourseOverviewMotion(fieldRef);
  return (
    <div
      ref={fieldRef}
      data-course-field
      className={styles.field}
      aria-hidden="true"
      data-motion-active={active || undefined}
    >
      <svg viewBox="0 0 580 400" fill="none" className={styles.fieldScene}>
        <defs>
          <pattern
            id={patternId}
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
            patternTransform="matrix(1 -.3 1 .3 -300 60)"
          >
            <path d="M56 0H0V56" className={styles.gridLine} />
          </pattern>
        </defs>
        <rect width="580" height="400" fill={`url(#${patternId})`} />
        <g className={styles.fieldNotation}>
          <text x="30" y="25">
            input → solve → output
          </text>
          <text x="440" y="75">
            range(n)
          </text>
          <text x="500" y="360">
            f(x)
          </text>
          <path
            d="M490 340h38m-19-19v38M28 200h24m-12-12v24"
            className={styles.gridLine}
          />
        </g>
        <SvgDrawing.Line
          d={overviewField.route}
          strokeWidth={1.2}
          className={styles.fieldRoute}
        />
        <SvgDrawing.Line
          d={overviewField.route}
          strokeWidth={2.5}
          pathLength={100}
          dashArray="7 93"
          className={styles.fieldPulse}
        />
        <g className={styles.fieldNodes}>
          <circle cx="75" cy="45" r="4" />
          <circle cx="470" cy="300" r="4" />
          <circle cx="540" cy="185" r="4" />
        </g>
      </svg>
    </div>
  );
};
