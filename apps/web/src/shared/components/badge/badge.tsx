import { cssUtils } from "~/shared/lib/css-utils";
import type { BadgeTypes } from "./badge.types";
import styles from "./badge.module.css";

export const Badge: React.FC<BadgeTypes.Props> = ({
  tone = "neutral",
  presentation = "status",
  surface,
  icon,
  fullWidth = false,
  children,
  className,
  ...badgeProps
}) => {
  return (
    <span
      {...badgeProps}
      data-badge=""
      data-tone={tone}
      data-presentation={presentation}
      data-surface={surface}
      data-full-width={fullWidth || undefined}
      className={cssUtils.cx(styles.root, className)}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
