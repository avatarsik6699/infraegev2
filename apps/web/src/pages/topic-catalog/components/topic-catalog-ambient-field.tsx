import { SvgPattern } from "~/shared/components/svg-pattern";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import styles from "../topic-catalog-page.module.css";

const routeSegments = [
  "M-90 310C210 170 300 520 590 360S1030 110 1530 290",
  "M1520 980C1160 820 1060 1270 760 1110S300 920-80 1230",
  "M-100 1930C280 1700 430 2220 780 2010S1180 1730 1520 2060",
  "M1510 2850C1170 2630 990 3120 650 2940S250 2700-90 3060",
] as const;

export const TopicCatalogAmbientField: React.FC = () => (
  <div className={styles.ambientField} aria-hidden="true">
    <svg
      className={styles.ambientScene}
      viewBox="0 0 1440 3600"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
    >
      <defs>
        <radialGradient id="catalog-paper-light">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.78" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <SvgPattern.Grid
        bounds={{ x: 0, y: 0, width: 1440, height: 3600 }}
        cell={{ width: 220, height: 110 }}
        className={styles.ambientGrid}
        lineClassName={styles.ambientGridLine}
      />
      <ellipse
        className={styles.ambientPaperLight}
        cx="250"
        cy="720"
        rx="520"
        ry="620"
        fill="url(#catalog-paper-light)"
      />
      <ellipse
        className={styles.ambientPaperLight}
        cx="1180"
        cy="2360"
        rx="560"
        ry="720"
        fill="url(#catalog-paper-light)"
      />

      <g className={styles.ambientRoutes}>
        {routeSegments.map((segment) => (
          <SvgDrawing.Line
            className={styles.ambientRoute}
            d={segment}
            dashArray="2 8"
            pathLength={100}
            strokeWidth={1.15}
            key={segment}
          />
        ))}
        {routeSegments.map((segment) => (
          <SvgDrawing.Line
            className={styles.ambientRoutePulse}
            d={segment}
            dashArray="5 95"
            pathLength={100}
            strokeWidth={2}
            key={`pulse-${segment}`}
          />
        ))}
      </g>

      <g className={styles.ambientNodes}>
        <circle cx="590" cy="360" r="4" />
        <circle cx="760" cy="1110" r="4" />
        <circle cx="780" cy="2010" r="4" />
        <circle cx="650" cy="2940" r="4" />
      </g>

      <g className={styles.ambientNotation}>
        <text x="72" y="470">
          01
        </text>
        <text x="1240" y="620">
          05
        </text>
        <text x="210" y="1060">
          08
        </text>
        <text x="1110" y="1430">
          10
        </text>
        <text x="110" y="1900">
          16
        </text>
        <text x="1190" y="2320">
          19 → 21
        </text>
        <text x="290" y="2810">
          24
        </text>
        <text x="1260" y="3260">
          27
        </text>
        <text x="1010" y="900">
          2ⁿ
        </text>
        <text x="360" y="1580">
          f(n − 1)
        </text>
        <text x="1040" y="2740">{`{ data }`}</text>
      </g>

      <g className={styles.ambientCalibration}>
        <path d="M110 760h34m-17-17v34M1280 1550h34m-17-17v34M170 2490h34m-17-17v34M1160 3320h34m-17-17v34" />
      </g>
    </svg>
  </div>
);
