import { Link } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { FragmentLinkTypes } from "./fragment-link.types";
import styles from "./fragment-link.module.css";

export const FragmentLink: React.FC<FragmentLinkTypes.Props> = ({
  icon = true,
  presentation,
  hierarchy = "text",
  ...props
}) => {
  // F35: an explicit presentation wins; an icon-less link without one is
  // quiet navigation (skip link, page outline).
  const mode = presentation ?? (icon ? "inline" : "navigation");
  return (
    <a
      {...props.anchorProps}
      href={`#${props.hash}`}
      data-hierarchy={hierarchy}
      data-presentation={mode}
      className={cssUtils.cx(styles.root, props.className)}
    >
      {icon && <Link className={styles.icon} aria-hidden="true" />}
      <span>{props.children}</span>
    </a>
  );
};
