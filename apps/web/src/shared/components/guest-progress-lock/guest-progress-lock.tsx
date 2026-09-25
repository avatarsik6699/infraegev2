import { LockKeyhole } from "lucide-react";
import { ActionLink } from "~/shared/components/action-link";
import { cssUtils } from "~/shared/lib/css-utils";
import type { GuestProgressLockTypes } from "./guest-progress-lock.types";
import styles from "./guest-progress-lock.module.css";

export const GuestProgressLock: React.FC<GuestProgressLockTypes.Props> = (
  props,
) => {
  const label = `Прогресс: 0 из ${String(props.total)}. Войти, чтобы сохранять прогресс`;
  return (
    <div
      className={cssUtils.cx(styles.root, props.className)}
      data-guest-progress-lock
    >
      <div className={styles.content} aria-hidden="true">
        {props.children}
      </div>
      <ActionLink
        ariaLabel={label}
        className={styles.link}
        icon="none"
        presentation="navigation"
        to="/sign-in"
        search={{ returnTo: props.returnTo }}
      >
        <LockKeyhole aria-hidden="true" size={24} strokeWidth={1.75} />
        <span>Войти, чтобы сохранять прогресс</span>
      </ActionLink>
    </div>
  );
};
