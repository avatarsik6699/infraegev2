import { Anchor } from "@mantine/core";
import styles from "./external-link.module.css";
import type { ExternalLinkTypes } from "./external-link.types";

export const ExternalLink: React.FC<ExternalLinkTypes.Props> = (props) => {
  return (
    <Anchor
      href={props.href}
      target={props.newTab ? "_blank" : undefined}
      rel={props.newTab ? "noopener noreferrer" : undefined}
      className={props.className}
      aria-label={props.ariaLabel}
    >
      {props.children}
      {props.newTab && (
        <span className={styles.visuallyHidden}>
          {" "}(откроется в новой вкладке)
        </span>
      )}
    </Anchor>
  );
};
