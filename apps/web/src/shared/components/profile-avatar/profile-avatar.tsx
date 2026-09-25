import { cssUtils } from "~/shared/lib/css-utils";
import styles from "./profile-avatar.module.css";

type Props = {
  initial: string;
  className?: string;
  size?: "default" | "large";
};

export const ProfileAvatar: React.FC<Props> = (props) => (
  <span
    aria-hidden="true"
    className={cssUtils.cx(styles.root, props.className)}
    data-profile-avatar
    data-size={props.size ?? "default"}
  >
    {props.initial}
  </span>
);
