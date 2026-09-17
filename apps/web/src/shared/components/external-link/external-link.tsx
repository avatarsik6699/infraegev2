import { ArrowUpRight } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ExternalLinkTypes } from "./external-link.types";
import styles from "./external-link.module.css";

export const ExternalLink: React.FC<ExternalLinkTypes.Props> = (props) => {
  const hierarchy = props.presentation === "action" ? "text" : "default";

  return (
    <a
      href={props.href}
      target={props.newTab ? "_blank" : undefined}
      rel={props.newTab ? "noopener noreferrer" : undefined}
      className={cssUtils.cx(
        styles.root,
        hierarchy === "text" ? styles.action : undefined,
        props.className,
      )}
      aria-label={props.ariaLabel}
      data-hierarchy={hierarchy}
      data-presentation={props.presentation ?? "inline"}
    >
      <span className={styles.label} data-external-link-label>
        {props.children}
      </span>
      <ArrowUpRight
        className={styles.icon}
        aria-hidden="true"
        strokeWidth={2}
        data-external-link-icon
      />
      {props.newTab && (
        <span className={styles.visuallyHidden}>
          {" "}
          (откроется в новой вкладке)
        </span>
      )}
    </a>
  );
};
