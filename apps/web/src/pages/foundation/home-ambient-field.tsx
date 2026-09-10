import { SvgDrawing } from "~/shared/components/svg-drawing";
import { HomeAmbientNotation } from "./home-ambient-notation";
import styles from "./foundation-page.module.css";

const homeField = {
  routes: [
    "M-80 200C170 40 480 160 650 70S1130 40 1680 180",
    "M-80 600C150 690 230 470 490 560S910 830 1680 570",
  ],
};

export const HomeAmbientField: React.FC = () => (
  <div className={styles.ambientField} aria-hidden="true" data-home-ambient>
    <div
      className={styles.ambientIllumination}
      data-home-motion="field-light"
    />
    <svg
      className={styles.ambientScene}
      viewBox="0 0 1600 800"
      preserveAspectRatio="none"
      fill="none"
    >
      {homeField.routes.map((d, index) => (
        <g key={d} className={styles.ambientRoute} data-field-route={index}>
          <SvgDrawing.Line d={d} strokeWidth={0.9} opacity={0.2} />
          <SvgDrawing.Line
            className={styles.ambientRouteFlow}
            d={d}
            strokeWidth={1.7}
            pathLength={100}
            dashArray="7 93"
          />
        </g>
      ))}
    </svg>
    <HomeAmbientNotation name="algorithm" />
    <HomeAmbientNotation name="byte" />
    <HomeAmbientNotation name="traversal" />
    <HomeAmbientNotation name="logicPulse" />
    <HomeAmbientNotation name="powers" />
  </div>
);
