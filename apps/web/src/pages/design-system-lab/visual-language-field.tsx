import { SvgDrawing } from "~/shared/components/svg-drawing";
import { SvgPattern } from "~/shared/components/svg-pattern";
import styles from "./visual-language-specimen.module.css";

export const VisualLanguageField: React.FC = () => (
  <svg
    className={styles.field}
    viewBox="0 0 640 360"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <SvgPattern.Grid
      bounds={{ x: 0, y: 0, width: 640, height: 360 }}
      cell={{ width: 64, height: 64 }}
      transform="matrix(1 -.3 1 .3 -300 60)"
      lineClassName={styles.gridLine}
    />
    <SvgPattern.Preset
      bounds={{ x: 0, y: 0, width: 640, height: 360 }}
      contentClassName={styles.notation}
      labels={[{ id: "step", text: "input → solve → output", x: 20, y: 50 }]}
    />
    <SvgDrawing.Line
      d="M-20 260C120 80 200 310 340 220S520 60 670 160"
      className={styles.route}
      strokeWidth={1.5}
    />
  </svg>
);
