import { SvgPattern } from "~/shared/components/svg-pattern";
import styles from "./page-background.module.css";

export const PageBackground: React.FC = () => (
  <svg
    className={styles.root}
    aria-hidden="true"
    focusable="false"
    data-page-grid
  >
    <SvgPattern.Grid
      bounds={{ x: 0, y: 0, width: "100%", height: "100%" }}
      cell={{ width: 88, height: 64 }}
      transform="skewY(-12)"
      lineClassName={styles.line}
      name="page-grid"
    />
  </svg>
);
