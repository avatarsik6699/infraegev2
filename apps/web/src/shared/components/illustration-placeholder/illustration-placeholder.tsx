import { cssUtils } from "~/shared/lib/css-utils";
import type { IllustrationPlaceholderTypes } from "./illustration-placeholder.types";
import styles from "./illustration-placeholder.module.css";

/** Reserved slot for an architect-supplied illustration (DESIGN.md › Illustrations). */
export const IllustrationPlaceholder: React.FC<
  IllustrationPlaceholderTypes.Props
> = (props) => (
  <div
    className={cssUtils.cx(styles.root, props.className)}
    data-illustration-placeholder
    aria-hidden="true"
  />
);
