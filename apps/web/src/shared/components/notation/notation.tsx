import { breakable } from "~/shared/components/learning-content/formula-block/formula-text";
import { cssUtils } from "~/shared/lib/css-utils";
import type { NotationTypes } from "./notation.types";
import styles from "./notation.module.css";

export const Notation: React.FC<NotationTypes.Props> = ({
  kind = "code",
  ...props
}) => {
  const Tag = kind === "formula" ? "var" : "code";
  return (
    <Tag
      className={cssUtils.cx(styles.root, props.className)}
      data-kind={kind}
      data-emphasis={props.emphasis}
    >
      {isSheetFormula(props.children)
        ? breakable(props.children, "notation")
        : props.children}
    </Tag>
  );
};

/** An Excel formula breaks only after «;», not inside a reference (Change 184). */
function isSheetFormula(children: React.ReactNode): children is string {
  return (
    typeof children === "string" &&
    children.startsWith("=") &&
    children.includes(";")
  );
}
