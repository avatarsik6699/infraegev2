import { ArrowUpRight, Mail } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ExternalLinkTypes } from "./external-link.types";
import styles from "./external-link.module.css";

export const ExternalLink: React.FC<ExternalLinkTypes.Props> = (props) => {
  const hierarchy = props.presentation === "action" ? "text" : "default";
  const icon = props.href.startsWith("mailto:") ? (
    <Mail className={styles.icon} aria-hidden="true" />
  ) : (
    <ArrowUpRight
      className={styles.icon}
      aria-hidden="true"
      strokeWidth={2}
      data-external-link-icon
    />
  );

  return (
    <a
      href={props.href}
      target={props.newTab ? "_blank" : undefined}
      rel={props.newTab ? "noopener noreferrer" : undefined}
      className={cssUtils.cx(styles.root, props.className)}
      aria-label={props.ariaLabel}
      data-hierarchy={hierarchy}
      data-presentation={props.presentation ?? "inline"}
    >
      <span className={styles.label} data-external-link-label>
        {props.children}
      </span>
      {props.icon === "none" ? null : icon}
      {props.newTab && (
        <span className={styles.visuallyHidden}>
          {" "}
          (откроется в новой вкладке)
        </span>
      )}
    </a>
  );
};
