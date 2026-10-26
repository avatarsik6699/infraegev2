import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { billingFormat } from "~/entities/billing";
import { accountApi, useAccountSession } from "~/features/account";
import { ApiError } from "~/shared/api";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { InfoPopover } from "~/shared/components/info-popover";
import { PasswordConfirmationDialog } from "~/shared/components/password-confirmation-dialog";
import { ProfileAvatar } from "~/shared/components/profile-avatar";
import {
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "~/shared/components/tabs";
import { Typography } from "~/shared/components/typography";
import { authProviderNavigation } from "~/shared/lib/auth-provider-navigation";
import { AccountAccess } from "./components/account-access";
import { ReauthDialog } from "./components/reauth-dialog";
import { AccountOverview } from "./components/account-overview";
import { EmailMethodForm } from "./components/email-method-form";
import { LoginMethodIcon } from "./components/login-method-icon";
import { SignedInDevices } from "./components/signed-in-devices";
import styles from "./account-page.module.css";
import type { AccountProfileTypes } from "./account-profile.types";
import { accountPageHelpers } from "./account-page.helpers";
import { recentAuth, type ResumeIntent } from "./model/recent-auth";

export const AccountProfile: React.FC<AccountProfileTypes.Props> = (props) => {
  const session = useAccountSession();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(
    props.authError
      ? accountPageHelpers.authErrorMessage(props.authError, "profile")
      : null,
  );
  // Change 227: the action waiting for «Подтвердите, что это вы», and the open confirmation
  const [reauthFor, setReauthFor] = useState<ResumeIntent | null>(null);
  const [confirming, setConfirming] = useState<ResumeIntent | null>(null);
  const [emailResumed, setEmailResumed] = useState(false);
  const [tab, setTab] = useState<string>(
    props.tab === "access" && !props.billing
      ? "overview"
      : (props.tab ?? "overview"),
  );
  const account = session.account;
  const resume = props.resume;
  // a second start would replace the provider cookie of the first (React re-runs effects)
  const resumed = useRef(false);
  useEffect(
    function resumeAfterProviderFx() {
      if (!account || (!resume && !props.authError) || resumed.current) return;
      resumed.current = true;
      // the confirmation came back from a provider: continue once, then clean the address
      if (resume) proceed(resume);
      void navigate({
        to: "/account",
        search: { tab: "settings" },
        replace: true,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per returned intent
    [account?.id, resume],
  );
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
  const act = async (action: () => Promise<void>, intent?: ResumeIntent) => {
    setPending(true);
    setError(null);
    try {
      await action();
      await session.refresh();
    } catch (reason) {
      if (intent && reason instanceof ApiError && reason.status === 403)
        setReauthFor(intent);
      else if (reason instanceof ApiError && reason.status === 429)
        setError("Слишком много попыток. Подождите минуту и повторите.");
      else setError("Действие не выполнено. Попробуйте ещё раз.");
    } finally {
      setPending(false);
    }
  };
  /** Runs a login-method change now, or first asks to confirm the sign-in. */
  const guard = (intent: ResumeIntent, run: () => void) => {
    if (recentAuth.isRecent(session.account!)) run();
    else setReauthFor(intent);
  };
  const startLink = (provider: "vk" | "yandex") => {
    void act(async () => {
      const url = await accountApi.linkProvider(provider, session.csrfToken);
      if (!url) throw new Error("Provider URL missing");
      authProviderNavigation.leave(url);
    }, `link:${provider}`);
  };
  /** The confirmed action continues: a link starts, a removal asks once more. */
  function proceed(intent: ResumeIntent) {
    setReauthFor(null);
    setError(null);
    if (intent === "link:vk" || intent === "link:yandex")
      startLink(intent === "link:vk" ? "vk" : "yandex");
    else if (intent === "email") setEmailResumed(true);
    else setConfirming(intent);
  }
  const confirmation = (intent: ResumeIntent) => ({
    open: confirming === intent,
    onOpenChange: (open: boolean) => {
      if (open) guard(intent, () => setConfirming(intent));
      else setConfirming(null);
    },
    onError: (reason: unknown) => {
      if (reason instanceof ApiError && reason.status === 403) {
        setConfirming(null);
        setReauthFor(intent);
      }
    },
  });
  const accessUntil =
    props.billing?.access?.status === "ready"
      ? props.billing.access.until
      : null;
  const deletionConsequence = accessUntil
    ? ` Оплаченный доступ до ${billingFormat.date(accessUntil)} закончится, а деньги за неиспользованные полные дни вернутся на карту, с которой вы платили.`
    : "";
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
            Профиль
          </Typography.Title>
          <Typography.Text tone="muted">
            {session.account.email ?? "Аккаунт без адреса почты"}
          </Typography.Text>
        </div>
        <Button
          className={styles.logout}
          type="button"
          hierarchy="secondary"
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
      <TabsRoot value={tab} onValueChange={setTab} className={styles.tabs}>
        <TabsList label="Разделы профиля" className={styles.tabList}>
          <TabsTab value="overview">Обзор</TabsTab>
          {props.billing ? <TabsTab value="access">Доступ</TabsTab> : null}
          <TabsTab value="settings">Настройки</TabsTab>
        </TabsList>
        {props.billing ? (
          <TabsPanel value="access" className={styles.tabPanel}>
            <AccountAccess access={props.billing.access} />
          </TabsPanel>
        ) : null}
        <TabsPanel value="overview" className={styles.tabPanel}>
          <AccountOverview
            practiceSummary={props.practiceSummary}
            topicSummary={props.topicSummary}
          />
        </TabsPanel>
        <TabsPanel value="settings" className={styles.tabPanel}>
          <section
            className={styles.profileSettings}
            id="settings"
            aria-labelledby="methods-title"
          >
            <div className={styles.sectionHeading}>
              <Typography.Title order={2} id="methods-title">
                Способы входа
              </Typography.Title>
              <InfoPopover label="О подтверждении входа">
                Если с входа прошло больше 10 минут, перед изменением способов
                входа или удалением аккаунта мы попросим подтвердить, что это
                вы.
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
                      <Typography.Text
                        tone="muted"
                        className={styles.methodStatus}
                      >
                        {methodStatus}
                      </Typography.Text>
                    </div>
                    <div className={styles.methodActions}>
                      {connected && methods.length > 1 ? (
                        <ConfirmationDialog
                          triggerLabel="Отвязать"
                          triggerAppearance="subtle"
                          triggerAriaLabel={`Отвязать ${accountPageHelpers.providerLabels[provider]}`}
                          title={`Отвязать ${accountPageHelpers.providerLabels[provider]}?`}
                          description="После отвязки этот способ больше не позволит войти в аккаунт. Сохранённый прогресс останется здесь."
                          confirmLabel="Отвязать способ входа"
                          errorMessage={accountPageHelpers.unlinkError}
                          {...confirmation(`unlink:${provider}`)}
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
                            guard(`link:${provider}`, () =>
                              startLink(provider),
                            );
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
              <EmailMethodForm
                pendingEmail={session.account.email ?? null}
                resumed={emailResumed}
                onNeedsReauth={() => setReauthFor("email")}
              />
            ) : null}
            {error ? (
              <Typography.Text className={styles.error} role="alert">
                {error}
              </Typography.Text>
            ) : null}
          </section>
          <SignedInDevices />
          <section
            className={styles.profileSafety}
            aria-labelledby="safety-title"
          >
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
                description={`Все сеансы будут отозваны, а сохранённый прогресс удалён без возможности восстановления.${deletionConsequence} Для подтверждения введите текущий пароль.`}
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
                description={`Все сеансы будут отозваны, а сохранённый прогресс удалён без возможности восстановления.${deletionConsequence}`}
                confirmLabel="Удалить аккаунт"
                errorMessage={accountPageHelpers.providerDeletionError}
                {...confirmation("delete")}
                onConfirm={async () => {
                  await accountApi.deleteAccount(session.csrfToken);
                  await session.refresh();
                  await navigate({ to: "/" });
                }}
              />
            )}
          </section>
        </TabsPanel>
      </TabsRoot>
      <ReauthDialog
        intent={reauthFor}
        onClose={() => setReauthFor(null)}
        onConfirmed={proceed}
        providers={accountPageHelpers.providers.filter(
          (provider) =>
            props.enabledProviders.includes(provider) &&
            methods.some((method) => method.provider === provider),
        )}
      />
    </div>
  );
};
