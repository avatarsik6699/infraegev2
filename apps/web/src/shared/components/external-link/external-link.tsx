import { ArrowUpRight } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ExternalLinkTypes } from "./external-link.types";
import styles from "./external-link.module.css";

export const ExternalLink: React.FC<ExternalLinkTypes.Props> = (props) => {
  return (
    <a
      href={props.href}
      target={props.newTab ? "_blank" : undefined}
      rel={props.newTab ? "noopener noreferrer" : undefined}
      className={cssUtils.cx(styles.root, props.className)}
      aria-label={props.ariaLabel}
    >
      {props.children}
      <ArrowUpRight
        className={styles.icon}
        aria-hidden="true"
        strokeWidth={2}
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
