import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ActionLinkTypes } from "./action-link.types";
import styles from "./action-link.module.css";

const icons = {
  back: ArrowLeft,
  forward: ArrowRight,
} as const;

export const ActionLink: React.FC<ActionLinkTypes.Props> = ({
  hierarchy = "secondary",
  to,
  children,
  className,
  ariaLabel,
  icon,
}) => {
  const Icon = icon ? icons[icon] : null;

  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      data-hierarchy={hierarchy}
      data-icon={icon}
      className={cssUtils.cx(styles.root, className)}
    >
      {Icon && icon !== "forward" ? (
        <Icon className={styles.icon} aria-hidden="true" strokeWidth={1.8} />
      ) : null}
      <span className={styles.label}>{children}</span>
      {Icon && icon === "forward" ? (
        <Icon className={styles.icon} aria-hidden="true" strokeWidth={1.8} />
      ) : null}
    </Link>
  );
};
