import { cssUtils } from "~/shared/lib/css-utils";
import type { TypographyTypes } from "../typography.types";
import styles from "./typography-prose.module.css";

export const TypographyProse: React.FC<TypographyTypes.ProseProps> = (
  props,
) => {
  return (
    <div {...props} className={cssUtils.cx(styles.root, props.className)}>
      {props.children}
    </div>
  );
};
