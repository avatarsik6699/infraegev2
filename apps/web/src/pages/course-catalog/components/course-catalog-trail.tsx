import { useRef } from "react";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { useElementActivity } from "~/shared/lib/element-activity";
import styles from "../course-catalog-page.module.css";

const catalogTrail = {
  route: "M479 751C350 751 209 750 93 771C-29 793 1 890 48 917",
};

export const CourseCatalogTrail: React.FC = () => {
  const trailRef = useRef<HTMLDivElement>(null);
  const active = useElementActivity(trailRef);
  return (
    <div
      ref={trailRef}
      className={styles.catalogTrail}
      aria-hidden="true"
      data-motion-active={active || undefined}
    >
      <svg viewBox="0 0 1200 1200" preserveAspectRatio="none" fill="none">
        <SvgDrawing.Line
          d={catalogTrail.route}
          strokeWidth={1.6}
          className={styles.trailLine}
        />
        <SvgDrawing.Line
          d={catalogTrail.route}
          strokeWidth={3}
          pathLength={100}
          dashArray="8 92"
          className={styles.trailPulse}
        />
        <g className={styles.trailNodes}>
          <circle cx="479" cy="751" r="5" />
          <circle cx="48" cy="917" r="5" />
        </g>
      </svg>
    </div>
  );
};
