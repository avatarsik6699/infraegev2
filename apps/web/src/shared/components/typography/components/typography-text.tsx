import { cssUtils } from "~/shared/lib/css-utils";
import type { TypographyTypes } from "../typography.types";
import styles from "./typography-text.module.css";

export const TypographyText: React.FC<TypographyTypes.TextProps> = ({
  ariaLabel,
  children,
  className,
  component: Component = "p",
  variant = "body",
  tone = "default",
  truncate = false,
  lineClamp,
  style,
  ...textProps
}) => {
  return (
    <Component
      {...textProps}
      aria-label={ariaLabel}
      data-variant={variant}
      data-tone={tone}
      data-truncate={truncate || undefined}
      data-line-clamp={lineClamp ? "true" : undefined}
      style={{ ...style, WebkitLineClamp: lineClamp }}
      className={cssUtils.cx(styles.root, className)}
    >
      {children}
    </Component>
  );
};
