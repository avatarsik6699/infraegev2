import { cssUtils } from "~/shared/lib/css-utils";
import type { NotationTypes } from "./notation.types";
import styles from "./notation.module.css";

export const Notation: React.FC<NotationTypes.Props> = ({
  kind = "code",
  ...props
}) => {
  const Tag = kind;
  return (
    <Tag className={cssUtils.cx(styles.root, props.className)} data-kind={kind}>
      {props.children}
    </Tag>
  );
};
