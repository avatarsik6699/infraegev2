import { cssUtils } from "~/shared/lib/css-utils";
import type { DividerTypes } from "./divider.types";
import styles from "./divider.module.css";

export const Divider: React.FC<DividerTypes.Props> = ({
  purpose = "section",
  dashed = false,
  ...props
}) => {
  return (
    <svg
      className={cssUtils.cx(styles.root, props.className)}
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden="true"
    >
      <path
        className={cssUtils.cx(styles.path, { [styles.dashed]: dashed })}
        data-layer="primary"
        d="M0 5 Q 28 1 58 5 T 118 5 T 178 5 T 240 5"
      />
      {purpose === "comparison" && (
        <path
          className={cssUtils.cx(styles.path, { [styles.dashed]: dashed })}
          data-layer="secondary"
          d="M0 8 Q 28 4 58 8 T 118 8 T 178 8 T 240 8"
        />
      )}
    </svg>
  );
};
