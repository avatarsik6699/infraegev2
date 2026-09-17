import { Link } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { FragmentLinkTypes } from "./fragment-link.types";
import styles from "./fragment-link.module.css";

export const FragmentLink: React.FC<FragmentLinkTypes.Props> = ({
  icon = true,
  presentation = "inline",
  hierarchy = "text",
  ...props
}) => {
  return (
    <a
      {...props.anchorProps}
      href={`#${props.hash}`}
      data-hierarchy={hierarchy}
      data-presentation={presentation}
      className={cssUtils.cx(styles.root, props.className)}
    >
      {icon && (
        <Link className={styles.icon} aria-hidden="true" strokeWidth={2} />
      )}
      <span>{props.children}</span>
    </a>
  );
};
