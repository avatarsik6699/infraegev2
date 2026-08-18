import { createElement } from "react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { TypographyTypes } from "../typography.types";
import styles from "./typography-title.module.css";

export const TypographyTitle: React.FC<TypographyTypes.TitleProps> = ({
  children,
  order,
  lineClamp,
  className,
  style,
  ...headingProps
}) => {
  const component = `h${String(order)}` as
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return createElement(
    component,
    {
      ...headingProps,
      "data-order": order,
      "data-line-clamp": lineClamp ? "true" : undefined,
      style: { ...style, WebkitLineClamp: lineClamp },
      className: cssUtils.cx(styles.root, className),
    },
    children,
  );
};
