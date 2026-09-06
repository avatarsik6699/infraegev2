import { SvgDrawing } from "~/shared/components/svg-drawing";
import styles from "./drawn-link-underline.module.css";

const underlineFade = {
  from: { x: 0, y: 0 },
  to: { x: 100, y: 0 },
  stops: [
    { offset: 0, opacity: 0 },
    { offset: 0.08, opacity: 0.72 },
    { offset: 0.2, opacity: 1 },
    { offset: 0.88, opacity: 0.94 },
    { offset: 1, opacity: 0 },
  ],
} as const;

export const DrawnLinkUnderline: React.FC = () => (
  <svg
    className={styles.root}
    viewBox="0 0 100 7"
    preserveAspectRatio="none"
    aria-hidden="true"
    data-action-underline
    data-link-underline
  >
    <SvgDrawing.TaperedLine
      d="M0 3.8C18 2.5 38 2.3 55 3c17 .7 31 1.2 45 .1v1.3c-15 1-30 .5-45-.1C37.7 3.6 18 3.9 0 5.1Z"
      fade={underlineFade}
    />
  </svg>
);
