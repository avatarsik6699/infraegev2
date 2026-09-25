import { Link } from "@tanstack/react-router";
import { useAccountSession } from "~/features/account";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { ProfileAvatar } from "~/shared/components/profile-avatar";
import styles from "./public-header.module.css";

const PublicHeaderAccountNavigation: React.FC = () => {
  const session = useAccountSession();

  if (session.status === "loading") {
    return (
      <span
        className={styles.sessionStatus}
        data-header-session="loading"
        role="status"
      >
        Проверяем вход
      </span>
    );
  }

  if (session.status === "error") {
    return (
      <span className={styles.sessionStatus} data-header-session="error">
        <span role="status">Не удалось проверить вход</span>
        <Button
          className={styles.sessionRetry}
          density="compact"
          hierarchy="quiet"
          type="button"
          onClick={() => {
            void session.refresh();
          }}
        >
          Повторить
        </Button>
      </span>
    );
  }

  if (!session.account) {
    return (
      <ActionLink
        className={styles.accountLink}
        hierarchy="text"
        icon="login"
        presentation="navigation"
        to="/sign-in"
      >
        Войти
      </ActionLink>
    );
  }

  const initial =
    session.account.email?.trim().at(0)?.toLocaleUpperCase("ru") ?? "П";

  return (
    <span className={styles.accountNavigation} data-header-session="member">
      <ActionLink
        className={styles.progressLink}
        hierarchy="text"
        presentation="navigation"
        to="/account"
      >
        Мой прогресс
      </ActionLink>
      <span className={styles.accountDivider} aria-hidden="true" />
      <Link
        aria-label="Открыть профиль"
        className={styles.avatarLink}
        data-provider-only={session.account.email ? undefined : true}
        to="/account"
      >
        <ProfileAvatar initial={initial} />
      </Link>
    </span>
  );
};

export { PublicHeaderAccountNavigation };
