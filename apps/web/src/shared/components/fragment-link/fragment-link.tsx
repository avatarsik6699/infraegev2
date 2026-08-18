import { Link } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { FragmentLinkTypes } from "./fragment-link.types";
import styles from "./fragment-link.module.css";

export const FragmentLink: React.FC<FragmentLinkTypes.Props> = ({
  icon = true,
  ...props
}) => {
  return (
    <a
      {...props.anchorProps}
      href={`#${props.hash}`}
      className={cssUtils.cx(styles.root, props.className)}
    >
      {icon && (
        <Link className={styles.icon} aria-hidden="true" strokeWidth={2} />
      )}
      {props.children}
    </a>
  );
};
