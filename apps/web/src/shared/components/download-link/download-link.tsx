import { Download } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import styles from "./download-link.module.css";
import type { DownloadLinkTypes } from "./download-link.types";

export const DownloadLink: React.FC<DownloadLinkTypes.Props> = (props) => (
  <a
    href={props.href}
    download={props.downloadName ?? ""}
    aria-label={props.ariaLabel}
    className={cssUtils.cx(styles.root, props.className)}
    data-presentation={props.presentation ?? "action"}
  >
    {props.presentation === "navigation" ? (
      props.children
    ) : (
      <>
        <span>{props.children}</span>
        <Download className={styles.icon} aria-hidden="true" />
      </>
    )}
  </a>
);
