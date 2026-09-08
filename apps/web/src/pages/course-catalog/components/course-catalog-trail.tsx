import { useRef } from "react";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { useCourseCatalogMotion } from "../model/use-course-catalog-motion";
import styles from "../course-catalog-page.module.css";

const catalogTrail = {
  route:
    "M640 330C690 330 710 320 706 384C700 444 703 515 706 573S733 671 701 728C681 765 590 748 479 751S209 750 93 771C-29 793 1 890 48 917",
  side: "M1185 340C1250 371 1228 455 1197 496S1156 596 1208 645",
};

export const CourseCatalogTrail: React.FC = () => {
  const trailRef = useRef<HTMLDivElement>(null);
  const active = useCourseCatalogMotion(trailRef);
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
        <SvgDrawing.Line
          d={catalogTrail.side}
          strokeWidth={1.2}
          className={styles.trailLine}
        />
        <g className={styles.trailNodes}>
          <circle cx="706" cy="384" r="5" />
          <circle cx="706" cy="573" r="5" />
          <circle cx="479" cy="751" r="5" />
          <circle cx="48" cy="917" r="5" />
        </g>
      </svg>
    </div>
  );
};
