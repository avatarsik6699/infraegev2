import { useRouterState } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useAccountSession } from "~/features/account";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import styles from "./locked-task-state.module.css";

/**
 * Change 192: a task from a paid lesson opened by its own link. The API sends
 * no statement (403 `subscription_required`), so the page names the reason
 * and the way on; a guest signs in first, since access belongs to an account.
 */
export const LockedTaskState: React.FC = () => {
  const session = useAccountSession();
  const here = useRouterState({ select: (state) => state.location.pathname });
  return (
    <div className={styles.root} data-practice-locked>
      <Lock className={styles.lock} aria-hidden="true" />
      <Typography.Title order={1} className={styles.title}>
        Задача из закрытого урока
      </Typography.Title>
      <Typography.Text className={styles.text}>
        Условие и проверка ответа — с полным доступом. Банк задач остаётся
        бесплатным: там много задач того же типа.
      </Typography.Text>
      <div className={styles.actions}>
        {session.account ? (
          <ActionLink
            presentation="button"
            hierarchy="primary"
            to="/pricing"
            search={{ from: here }}
          >
            Открыть доступ
          </ActionLink>
        ) : (
          <ActionLink
            presentation="button"
            hierarchy="primary"
            to="/sign-in"
            search={{ returnTo: here }}
          >
            Войти
          </ActionLink>
        )}
        <ActionLink hierarchy="text" to="/practice">
          Банк задач
        </ActionLink>
      </div>
    </div>
  );
};
