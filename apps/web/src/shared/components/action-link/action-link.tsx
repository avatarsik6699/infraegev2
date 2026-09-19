import { createLink } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { forwardRef } from "react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ActionLinkTypes } from "./action-link.types";
import styles from "./action-link.module.css";

const ActionLinkRoot = forwardRef<HTMLAnchorElement, ActionLinkTypes.RootProps>(
  function ActionLinkRoot(
    {
      hierarchy = "secondary",
      presentation = "action",
      children,
      className,
      ariaLabel,
      icon,
      ...linkProps
    },
    ref,
  ) {
    return (
      <a
        {...linkProps}
        rel={
          linkProps.target === "_blank" ? "noopener noreferrer" : linkProps.rel
        }
        ref={ref}
        aria-label={ariaLabel}
        data-hierarchy={hierarchy}
        data-presentation={presentation}
        data-icon={icon}
        className={cssUtils.cx(
          styles.root,
          presentation === "button" ? styles.button : undefined,
          className,
        )}
      >
        {icon === "back" ? (
          <ArrowLeft className={styles.icon} aria-hidden="true" />
        ) : null}
        <span>{children}</span>
        {linkProps.target === "_blank" && (
          <ArrowUpRight className={styles.icon} aria-hidden="true" />
        )}
        {linkProps.target !== "_blank" &&
          (icon === "forward" ||
            (!icon &&
              (presentation === "inline" || presentation === "action"))) && (
            <ArrowRight className={styles.icon} aria-hidden="true" />
          )}
        {linkProps.target === "_blank" && (
          <span className={styles.visuallyHidden}>
            {" "}
            (откроется в новой вкладке)
          </span>
        )}
      </a>
    );
  },
);
const CreatedActionLink = createLink(ActionLinkRoot);
export const ActionLink =
  CreatedActionLink as unknown as React.FC<ActionLinkTypes.Props>;
