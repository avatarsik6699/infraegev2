import { cssUtils } from "~/shared/lib/css-utils";
import styles from "./paid-preview.module.css";

type Props = { children: React.ReactNode; className?: string };

/** The public opening of a paid subtopic or lesson, fading out (Change 192). */
export const PaidPreview: React.FC<Props> = (props) => (
  <div className={cssUtils.cx(styles.root, props.className)} data-paid-preview>
    {props.children}
  </div>
);
