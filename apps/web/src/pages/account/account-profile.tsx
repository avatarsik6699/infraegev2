import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { accountApi, useAccountSession } from "~/features/account";
import { ApiError } from "~/shared/api";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { InfoPopover } from "~/shared/components/info-popover";
import { PasswordConfirmationDialog } from "~/shared/components/password-confirmation-dialog";
import { ProfileAvatar } from "~/shared/components/profile-avatar";
import { Typography } from "~/shared/components/typography";
import { authProviderNavigation } from "~/shared/lib/auth-provider-navigation";
import { AccountOverview } from "./components/account-overview";
import { EmailMethodForm } from "./components/email-method-form";
import { LoginMethodIcon } from "./components/login-method-icon";
import styles from "./account-page.module.css";
import type { AccountProfileTypes } from "./account-profile.types";
import { accountPageHelpers } from "./account-page.helpers";

export const AccountProfile: React.FC<AccountProfileTypes.Props> = (props) => {
  const session = useAccountSession();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsReauthentication, setNeedsReauthentication] = useState(false);
  if (session.status === "loading")
    return (
      <Typography.Text className={styles.notice} role="status">
        Загружаем аккаунт…
      </Typography.Text>
    );
  if (session.status === "error")
    return (
      <div className={styles.secondary}>
        <Typography.Text className={styles.error} role="alert">
          Не удалось загрузить аккаунт. Проверьте подключение и повторите
          попытку.
        </Typography.Text>
        <Button
          type="button"
          hierarchy="secondary"
          onClick={() => {
            void session.refresh();
          }}
        >
          Повторить загрузку
        </Button>
      </div>
    );
  if (!session.account)
    return (
      <ActionLink to="/sign-in">Войти, чтобы управлять аккаунтом</ActionLink>
    );
  const methods = session.account.methods;
  const hasPassword = methods.some((method) => method.provider === "email");
  let emailMethodStatus = "Не подключено";
  if (session.account.email) emailMethodStatus = "Ожидает подтверждения";
  if (hasPassword) emailMethodStatus = "Подключено";
  const act = async (action: () => Promise<void>) => {
    setPending(true);
    setError(null);
    setNeedsReauthentication(false);
    try {
      await action();
      await session.refresh();
    } catch (reason) {
      setNeedsReauthentication(
        reason instanceof ApiError && reason.status === 403,
      );
      setError(
        reason instanceof ApiError && reason.status === 403
          ? "Подтвердите вход и повторите действие."
          : "Действие не выполнено. Попробуйте ещё раз.",
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <div className={styles.profile}>
      <header className={styles.profileIdentity}>
        <ProfileAvatar
          initial={
            session.account.email?.trim().at(0)?.toLocaleUpperCase("ru") ?? "П"
          }
          size="large"
        />
        <div className={styles.identityText}>
          <Typography.Title order={1} id="account-title">
            Аккаунт
          </Typography.Title>
          <Typography.Text tone="muted">
            {session.account.email ?? "Аккаунт без адреса почты"}
          </Typography.Text>
        </div>
        <Button
          className={styles.logout}
          type="button"
          hierarchy="quiet"
          surface="bare"
          iconStart={<LogOut size={18} aria-hidden="true" />}
          disabled={pending}
          onClick={() => {
            void act(async () => {
              await accountApi.logout(session.csrfToken);
              await session.refresh();
              await navigate({ to: "/" });
            });
          }}
        >
          Выйти
        </Button>
      </header>
      <AccountOverview practiceSummary={props.practiceSummary} />
      <section
        className={styles.profileSettings}
        id="settings"
        aria-labelledby="methods-title"
      >
        <div className={styles.sectionHeading}>
          <Typography.Title order={2} id="methods-title">
            Способы входа
          </Typography.Title>
          <InfoPopover label="О повторном подтверждении входа">
            Чтобы изменить способы входа, войдите повторно.
          </InfoPopover>
        </div>
        <ul className={styles.methods}>
          <li className={styles.method}>
            <LoginMethodIcon provider="email" />
            <div className={styles.methodIdentity}>
              <Typography.Text>Почта и пароль</Typography.Text>
              <Typography.Text tone="muted" className={styles.methodStatus}>
                {emailMethodStatus}
              </Typography.Text>
            </div>
          </li>
          {accountPageHelpers.providers.map((provider) => {
            const connected = methods.some(
              (method) => method.provider === provider,
            );
            const enabled = props.enabledProviders.includes(provider);
            let methodStatus = "Пока недоступно";
            if (enabled) methodStatus = "Не подключено";
            if (connected) methodStatus = "Подключено";
            return (
              <li className={styles.method} key={provider}>
                <LoginMethodIcon provider={provider} />
                <div className={styles.methodIdentity}>
                  <Typography.Text>
                    {accountPageHelpers.providerLabels[provider]}
                  </Typography.Text>
                  <Typography.Text tone="muted" className={styles.methodStatus}>
                    {methodStatus}
                  </Typography.Text>
                </div>
                <div className={styles.methodActions}>
                  {connected && enabled ? (
                    <Button
                      type="button"
                      hierarchy="quiet"
                      density="compact"
                      disabled={pending}
                      onClick={() => {
                        void act(async () => {
                          const url = await accountApi.reauthenticateProvider(
                            provider,
                            session.csrfToken,
                          );
                          if (!url) throw new Error("Provider URL missing");
                          authProviderNavigation.leave(url);
                        });
                      }}
                    >
                      Подтвердить вход
                    </Button>
                  ) : null}
                  {connected && methods.length > 1 ? (
                    <ConfirmationDialog
                      triggerLabel="Отвязать"
                      triggerAppearance="subtle"
                      triggerAriaLabel={`Отвязать ${accountPageHelpers.providerLabels[provider]}`}
                      title={`Отвязать ${accountPageHelpers.providerLabels[provider]}?`}
                      description="После отвязки этот способ больше не позволит войти в аккаунт. Сохранённый прогресс останется здесь."
                      confirmLabel="Отвязать способ входа"
                      errorMessage={accountPageHelpers.unlinkError}
                      onError={(reason) => {
                        setNeedsReauthentication(
                          reason instanceof ApiError && reason.status === 403,
                        );
                      }}
                      onConfirm={async () => {
                        await accountApi.unlinkProvider(
                          provider,
                          session.csrfToken,
                        );
                        await session.refresh();
                      }}
                    />
                  ) : null}
                  {!connected && enabled ? (
                    <Button
                      type="button"
                      hierarchy="quiet"
                      density="compact"
                      disabled={pending}
                      onClick={() => {
                        void act(async () => {
                          const url = await accountApi.linkProvider(
                            provider,
                            session.csrfToken,
                          );
                          if (!url) throw new Error("Provider URL missing");
                          authProviderNavigation.leave(url);
                        });
                      }}
                    >
                      Добавить
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        {!hasPassword ? (
          <EmailMethodForm pendingEmail={session.account.email ?? null} />
        ) : null}
        {error ? (
          <Typography.Text className={styles.error} role="alert">
            {error}
          </Typography.Text>
        ) : null}
        {needsReauthentication && hasPassword ? (
          <ActionLink
            presentation="inline"
            icon="none"
            to="/sign-in"
            search={{ returnTo: "/account" }}
          >
            Войти повторно
          </ActionLink>
        ) : null}
      </section>
      <section className={styles.profileSafety} aria-labelledby="safety-title">
        <Typography.Title order={2} id="safety-title">
          Безопасность аккаунта
        </Typography.Title>
        {hasPassword ? (
          <PasswordConfirmationDialog
            email={session.account.email ?? ""}
            triggerLabel="Удалить аккаунт"
            triggerAriaLabel="Удалить аккаунт и прогресс"
            triggerAppearance="danger"
            title="Удалить аккаунт?"
            description="Все сеансы будут отозваны, а сохранённый прогресс удалён без возможности восстановления. Для подтверждения введите текущий пароль."
            confirmLabel="Удалить аккаунт"
            errorMessage={accountPageHelpers.deletionError}
            onConfirm={async (password) => {
              await accountApi.deleteAccount(session.csrfToken, password);
              await session.refresh();
              await navigate({ to: "/" });
            }}
          />
        ) : (
          <ConfirmationDialog
            triggerLabel="Удалить аккаунт"
            triggerAriaLabel="Удалить аккаунт и прогресс"
            triggerAppearance="danger"
            title="Удалить аккаунт?"
            description="Все сеансы будут отозваны, а сохранённый прогресс удалён без возможности восстановления."
            confirmLabel="Удалить аккаунт"
            errorMessage={accountPageHelpers.providerDeletionError}
            onConfirm={async () => {
              await accountApi.deleteAccount(session.csrfToken);
              await session.refresh();
              await navigate({ to: "/" });
            }}
          />
        )}
      </section>
    </div>
  );
};
