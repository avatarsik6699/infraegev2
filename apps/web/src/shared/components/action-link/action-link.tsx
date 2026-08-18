import { Link } from "@tanstack/react-router";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ActionLinkTypes } from "./action-link.types";
import styles from "./action-link.module.css";

export const ActionLink: React.FC<ActionLinkTypes.Props> = ({
  hierarchy = "secondary",
  to,
  children,
  className,
  ariaLabel,
}) => {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      data-hierarchy={hierarchy}
      className={cssUtils.cx(styles.root, className)}
    >
      {children}
    </Link>
  );
};
