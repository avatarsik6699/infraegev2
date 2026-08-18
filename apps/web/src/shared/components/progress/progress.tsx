import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ProgressTypes } from "./progress.types";
import styles from "./progress.module.css";

export const Progress: React.FC<ProgressTypes.Props> = ({
  value,
  max = 100,
  label,
  valueText,
  className,
}) => (
  <BaseProgress.Root
    value={value}
    max={max}
    aria-label={label}
    aria-valuetext={valueText}
    className={cssUtils.cx(styles.root, className)}
  >
    <BaseProgress.Track className={styles.track}>
      <BaseProgress.Indicator className={styles.indicator} />
    </BaseProgress.Track>
  </BaseProgress.Root>
);
