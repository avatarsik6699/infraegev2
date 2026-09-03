import { cssUtils } from "~/shared/lib/css-utils";
import type { DownloadLinkTypes } from "./download-link.types";

export const DownloadLink: React.FC<DownloadLinkTypes.Props> = (props) => (
  <a
    href={props.href}
    download={props.downloadName ?? ""}
    aria-label={props.ariaLabel}
    className={cssUtils.cx(props.className)}
  >
    {props.children}
  </a>
);
