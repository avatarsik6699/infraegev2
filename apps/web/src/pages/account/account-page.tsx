import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import type { CourseProgressTypes } from "~/entities/course";
import {
  accountApi,
  safeReturnTo,
  useAccountSession,
  type Provider,
} from "~/features/account";
import { ApiError } from "~/shared/api";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { ExternalLink } from "~/shared/components/external-link";
import { Field } from "~/shared/components/field";
import { InfoPopover } from "~/shared/components/info-popover";
import { PageContainer } from "~/shared/components/page-container";
import { PasswordConfirmationDialog } from "~/shared/components/password-confirmation-dialog";
import { ProfileAvatar } from "~/shared/components/profile-avatar";
import { Typography } from "~/shared/components/typography";
import { authProviderNavigation } from "~/shared/lib/auth-provider-navigation";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { AccountOverview } from "./components/account-overview";
import { EmailMethodForm } from "./components/email-method-form";
import { LoginMethodIcon } from "./components/login-method-icon";
import { PasswordField } from "~/shared/components/password-field";
import { mailCooldown, type MailPurpose } from "./model/mail-cooldown";
import styles from "./account-page.module.css";

type Mode =
  "sign-in" | "register" | "verify" | "recovery" | "new-password" | "profile";
type Props = {
  mode: Mode;
  returnTo?: string;
  token?: string;
  practiceSummary?: readonly CourseProgressTypes.Lesson[] | null;
  enabledProviders?: readonly Provider[];
};
const providers = ["vk", "yandex", "telegram"] as const;
const providerLabels: Record<string, string> = {
  vk: "VK ID",
  yandex: "Яндекс ID",
  telegram: "Telegram",
  email: "Почта и пароль",
};
function deletionError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 403) {
    return "Не удалось подтвердить пароль. Проверьте его и повторите попытку.";
  }
  if (reason instanceof ApiError && reason.status === 401) {
    return "Сеанс закончился. Войдите снова и повторите удаление.";
  }
  return "Не удалось удалить аккаунт. Попробуйте ещё раз.";
}
function providerDeletionError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 403)
    return "Нужно повторно войти через привязанный сервис. Закройте окно, подтвердите вход и попробуйте снова.";
  if (reason instanceof ApiError && reason.status === 401)
    return "Сеанс закончился. Войдите снова и повторите удаление.";
  return "Не удалось удалить аккаунт. Попробуйте ещё раз.";
}
function unlinkError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 403)
    return "Нужно повторно подтвердить вход через привязанный способ.";
  if (reason instanceof ApiError && reason.status === 409)
    return "Последний способ входа отвязать нельзя.";
  return "Не удалось отвязать способ входа. Попробуйте ещё раз.";
}
function inputValue(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}
function formLabel(mode: Mode): string {
  switch (mode) {
    case "sign-in":
      return "Войти";
    case "register":
      return "Создать аккаунт";
    case "verify":
      return "Отправить письмо";
    case "recovery":
      return "Отправить ссылку";
    case "new-password":
      return "Сохранить пароль";
    case "profile":
      return "Сохранить пароль";
  }
}

type DeliveryPurpose = MailPurpose;

function deliveryError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 429) {
    return "Лимит отправки достигнут. Проверьте папку «Спам» и попробуйте позже.";
  }
  if (reason instanceof ApiError && reason.status === 503) {
    return "Почта временно недоступна. Попробуйте отправить ссылку позже.";
  }
  return "Не удалось отправить письмо. Проверьте подключение и повторите попытку.";
}

function registrationError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 503) {
    return "Почта временно недоступна. Попробуйте создать аккаунт позже.";
  }
  return "Не удалось создать аккаунт. Проверьте данные и попробуйте ещё раз.";
}

function signInError(reason: unknown): string {
  if (reason instanceof ApiError && reason.status === 401) {
    return "Не удалось войти. Проверьте почту и пароль.";
  }
  return "Не удалось войти. Попробуйте ещё раз.";
}

const DeliverySent: React.FC<{
  purpose: DeliveryPurpose;
  email: string;
  pending: boolean;
  onResend: () => Promise<boolean>;
  onChangeEmail: () => void;
}> = ({ purpose, email, pending, onResend, onChangeEmail }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    mailCooldown.remaining(purpose),
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds(mailCooldown.remaining(purpose));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [purpose]);
  const isVerification = purpose === "verification";
  return (
    <section className={styles.delivery} aria-labelledby="delivery-title">
      <Typography.Title order={2} id="delivery-title">
        {isVerification
          ? "Проверьте письмо для подтверждения"
          : "Проверьте письмо для восстановления"}
      </Typography.Title>
      <Typography.Text>
        Мы не сообщаем, возможна ли отправка для этого адреса. Если она
        возможна, письмо придёт на {email}. Проверьте также папку «Спам».
      </Typography.Text>
      <Typography.Text tone="muted">
        Ссылка действует ограниченное время и работает один раз.
      </Typography.Text>
      <div className={styles.actions}>
        <Button
          type="button"
          hierarchy="secondary"
          disabled={pending || remainingSeconds > 0}
          loading={pending}
          onClick={() => {
            void onResend().then((shouldStartCooldown) => {
              if (shouldStartCooldown)
                setRemainingSeconds(mailCooldown.remaining(purpose));
            });
          }}
        >
          {remainingSeconds > 0
            ? `Отправить ещё раз через ${remainingSeconds} с`
            : "Отправить ещё раз"}
        </Button>
        <Button
          type="button"
          hierarchy="quiet"
          disabled={pending}
          onClick={onChangeEmail}
        >
          Указать другой адрес
        </Button>
      </div>
    </section>
  );
};

export const AccountPage: React.FC<Props> = ({
  mode,
  returnTo,
  token,
  practiceSummary,
  enabledProviders = [],
}) => {
  const session = useAccountSession();
  const refreshSession = session.refresh;
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<{
    purpose: DeliveryPurpose;
    email: string;
  } | null>(null);
  const [invalidResetToken, setInvalidResetToken] = useState(false);
  const [formCooldown, setFormCooldown] = useState(0);
  const destination = safeReturnTo(returnTo);
  useEffect(() => {
    if (mode !== "register" && mode !== "recovery") return;
    const purpose = mode === "register" ? "verification" : "recovery";
    const update = () => setFormCooldown(mailCooldown.remaining(purpose));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [mode]);
  useEffect(() => {
    if (mode !== "verify" || !token) return;
    let active = true;
    void accountApi.verifyEmail(token).then(
      async () => {
        if (!active) return;
        await refreshSession();
        if (active) setNotice("Почта подтверждена.");
      },
      (reason) => {
        if (!active) return;
        if (reason instanceof ApiError && reason.status === 503) {
          setError(
            "Не удалось подтвердить почту. Попробуйте открыть ссылку позже.",
          );
          return;
        }
        setError("Ссылка недействительна или устарела. Запросите новую.");
      },
    );
    return () => {
      active = false;
    };
  }, [mode, token, refreshSession]);
  const submit = async (
    submittedMode: Mode,
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setNotice(null);
    const data = new FormData(event.currentTarget);
    const email = inputValue(data, "email");
    const password = inputValue(data, "password");
    if (submittedMode === "register" && data.get("privacy_consent") !== "on") {
      setError(
        "Подтвердите согласие на обработку данных, чтобы создать аккаунт.",
      );
      setPending(false);
      return;
    }
    try {
      switch (submittedMode) {
        case "sign-in":
          await accountApi.login(email, password);
          await session.refresh();
          await navigate({ to: destination });
          return;
        case "register":
          if (formCooldown > 0) {
            setError(
              `Подождите ${formCooldown} с перед повторной отправкой письма.`,
            );
            return;
          }
          await accountApi.register(email, password);
          mailCooldown.markSent("verification");
          setDelivery({ purpose: "verification", email });
          return;
        case "verify":
          await accountApi.requestVerification(email);
          setDelivery({ purpose: "verification", email });
          return;
        case "recovery":
          if (formCooldown > 0) {
            setError(
              `Подождите ${formCooldown} с перед повторной отправкой письма.`,
            );
            return;
          }
          await accountApi.requestPasswordReset(email, destination);
          mailCooldown.markSent("recovery");
          setDelivery({ purpose: "recovery", email });
          return;
        case "new-password":
          if (!token) return;
          await accountApi.confirmPasswordReset(token, password);
          await navigate({
            to: "/sign-in",
            search: { returnTo: destination },
            replace: true,
          });
          return;
        case "profile":
          return;
      }
    } catch (reason) {
      if (submittedMode === "sign-in") {
        setError(signInError(reason));
      } else if (submittedMode === "new-password") {
        if (reason instanceof ApiError && reason.status === 400) {
          setInvalidResetToken(true);
          setError("Ссылка недействительна или устарела. Запросите новую.");
        } else if (reason instanceof ApiError && reason.status === 503) {
          setError(
            "Сервис временно недоступен. Попробуйте сохранить пароль позже.",
          );
        } else {
          setError(
            "Не удалось обновить пароль. Проверьте данные и повторите попытку.",
          );
        }
      } else if (submittedMode === "register") {
        setError(registrationError(reason));
      } else {
        setError(deliveryError(reason));
      }
    } finally {
      setPending(false);
    }
  };
  const resend = async (): Promise<boolean> => {
    if (!delivery) return false;
    setPending(true);
    setError(null);
    try {
      if (delivery.purpose === "verification") {
        await accountApi.requestVerification(delivery.email);
      } else {
        await accountApi.requestPasswordReset(delivery.email, destination);
      }
      mailCooldown.markSent(delivery.purpose);
      setNotice(
        "Запрос отправлен. Если отправка возможна, проверьте почту и папку «Спам».",
      );
      return true;
    } catch (reason) {
      setError(deliveryError(reason));
      if (reason instanceof ApiError && reason.status === 429)
        mailCooldown.markSent(delivery.purpose);
      return reason instanceof ApiError && reason.status === 429;
    } finally {
      setPending(false);
    }
  };
  const titles: Record<Mode, string> = {
    "sign-in": "Войти",
    register: "Создать аккаунт",
    verify: "Подтвердить почту",
    recovery: "Восстановить пароль",
    "new-password": "Новый пароль",
    profile: "Аккаунт",
  };
  return (
    <div className={styles.page}>
      <PublicHeader />
      <PageContainer
        className={styles.main}
        data-profile={mode === "profile" || undefined}
      >
        <section
          className={styles.panel}
          data-auth-surface={mode !== "profile" || undefined}
          aria-label={mode === "profile" ? "Аккаунт" : undefined}
          aria-labelledby={mode === "profile" ? undefined : "account-title"}
        >
          {mode !== "profile" ? (
            <header className={styles.intro}>
              <Typography.Title order={1} id="account-title">
                {titles[mode]}
              </Typography.Title>
              {mode === "sign-in" ? (
                <Typography.Text tone="muted">
                  Прогресс будет сохраняться в аккаунте.
                </Typography.Text>
              ) : null}
            </header>
          ) : null}
          {notice ? (
            <Typography.Text className={styles.notice} role="status">
              {notice}
            </Typography.Text>
          ) : null}
          {error ? (
            <Typography.Text className={styles.error} role="alert">
              {error}
            </Typography.Text>
          ) : null}
          {mode === "profile" ? (
            <Profile
              practiceSummary={practiceSummary ?? null}
              enabledProviders={enabledProviders}
            />
          ) : null}
          {mode === "verify" && token ? (
            <div className={`${styles.secondary} ${styles.noScriptOnly}`}>
              <Typography.Text>
                Для подтверждения почты включите JavaScript и откройте эту
                ссылку снова.
              </Typography.Text>
              <ActionLink to="/register">Вернуться к регистрации</ActionLink>
            </div>
          ) : null}
          {delivery ? (
            <DeliverySent
              purpose={delivery.purpose}
              email={delivery.email}
              pending={pending}
              onResend={resend}
              onChangeEmail={() => {
                setDelivery(null);
                setNotice(null);
                setError(null);
              }}
            />
          ) : null}
          {mode !== "profile" && !delivery && mode !== "verify" ? (
            <AccountForm
              mode={invalidResetToken ? "recovery" : mode}
              token={token}
              pending={pending}
              cooldown={formCooldown}
              onSubmit={submit}
            />
          ) : null}
          {mode === "verify" && token && notice ? (
            <ActionLink to={session.account ? "/account" : "/sign-in"}>
              {session.account ? "Вернуться к аккаунту" : "Войти"}
            </ActionLink>
          ) : null}
          {mode === "verify" && token && error ? (
            <ActionLink to="/register">Начать регистрацию заново</ActionLink>
          ) : null}
          {mode === "sign-in" ? (
            <div className={styles.secondary}>
              <Link to="/register" search={{ returnTo: destination }}>
                Создать аккаунт
              </Link>
              <Link
                to="/password-reset"
                search={{ token: undefined, returnTo: destination }}
              >
                Не помню пароль
              </Link>
            </div>
          ) : null}
          {mode === "sign-in" || mode === "register" ? (
            <ProviderLinks
              mode={mode}
              returnTo={destination}
              enabledProviders={enabledProviders}
            />
          ) : null}
        </section>
      </PageContainer>
      <PublicFooter />
    </div>
  );
};

const AccountForm: React.FC<{
  mode: Mode;
  token?: string;
  pending: boolean;
  cooldown: number;
  onSubmit: (
    submittedMode: Mode,
    event: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>;
}> = ({ mode, token, pending, cooldown, onSubmit }) => {
  const enhanced = useIsEnhanced();
  if (mode === "new-password" && !token)
    return (
      <>
        <Typography.Text className={styles.error} role="alert">
          Ссылка для восстановления неполная. Запросите новую.
        </Typography.Text>
        <AccountForm
          mode="recovery"
          pending={pending}
          cooldown={cooldown}
          onSubmit={onSubmit}
        />
      </>
    );
  const email = mode !== "new-password";
  const password =
    mode === "sign-in" || mode === "register" || mode === "new-password";
  let autocomplete: "new-password" | "current-password" = "current-password";
  if (mode === "new-password" || mode === "register")
    autocomplete = "new-password";
  return (
    <form
      className={styles.form}
      data-enhanced={enhanced || undefined}
      method="post"
      onSubmit={(event) => {
        void onSubmit(mode, event);
      }}
    >
      <Typography.Text className={`${styles.notice} ${styles.noScriptOnly}`}>
        Для отправки формы нужен JavaScript.
      </Typography.Text>
      {email ? (
        <Field
          name="email"
          type="email"
          autoComplete="email"
          label="Электронная почта"
          placeholder="name@example.ru"
          required
        />
      ) : null}
      {mode === "new-password" ? (
        <input
          aria-hidden="true"
          autoComplete="username"
          className={styles.passwordUsername}
          name="username"
          tabIndex={-1}
          type="email"
        />
      ) : null}
      {password ? (
        <PasswordField
          name="password"
          autoComplete={autocomplete}
          label="Пароль"
          placeholder={
            mode === "register" || mode === "new-password"
              ? "Придумайте пароль"
              : "Введите пароль"
          }
          help={
            mode === "register" || mode === "new-password"
              ? "Не менее 12 символов. Не используйте пароль от другого сайта."
              : undefined
          }
          required
          minLength={mode === "sign-in" ? 1 : 12}
        />
      ) : null}
      {mode === "register" ? (
        <div className={styles.consentRow}>
          <input
            id="privacy-consent"
            type="checkbox"
            name="privacy_consent"
            required
            className={styles.consentCheckbox}
          />
          <label htmlFor="privacy-consent">
            Даю{" "}
            <Link to="/consent">согласие на обработку персональных данных</Link>
            . Сведения о работе сайта — в{" "}
            <Link to="/privacy">политике обработки данных</Link>.
          </label>
        </div>
      ) : null}
      <div className={styles.actions}>
        <Button
          type="submit"
          loading={pending}
          disabled={
            !enhanced ||
            (cooldown > 0 && (mode === "register" || mode === "recovery"))
          }
        >
          {cooldown > 0 && (mode === "register" || mode === "recovery")
            ? `Повторить через ${cooldown} с`
            : formLabel(mode)}
        </Button>
        {mode !== "sign-in" ? (
          <ActionLink to="/sign-in">Уже есть аккаунт</ActionLink>
        ) : null}
      </div>
    </form>
  );
};

const ProviderLinks: React.FC<{
  mode: "sign-in" | "register";
  returnTo: string;
  enabledProviders: readonly Provider[];
}> = ({ mode, returnTo, enabledProviders }) => (
  <div className={styles.providerSection}>
    <Typography.Text className={styles.providerLabel} tone="muted">
      {mode === "sign-in" ? "Или войдите через" : "Или создайте аккаунт через"}
    </Typography.Text>
    {providers.map((provider) =>
      enabledProviders.includes(provider) ? (
        <ExternalLink
          className={styles.providerLink}
          key={provider}
          href={`/api/auth/providers/${provider}/start?return_to=${encodeURIComponent(returnTo)}`}
        >
          <LoginMethodIcon provider={provider} />
          {providerLabels[provider]}
        </ExternalLink>
      ) : (
        <button
          className={styles.providerLink}
          key={provider}
          type="button"
          disabled
          title="Вход через этот сервис пока недоступен"
        >
          <LoginMethodIcon provider={provider} />
          {providerLabels[provider]}
        </button>
      ),
    )}
  </div>
);

const Profile: React.FC<{
  practiceSummary: readonly CourseProgressTypes.Lesson[] | null;
  enabledProviders: readonly Provider[];
}> = (props) => {
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
          {providers.map((provider) => {
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
                  <Typography.Text>{providerLabels[provider]}</Typography.Text>
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
                      triggerAriaLabel={`Отвязать ${providerLabels[provider]}`}
                      title={`Отвязать ${providerLabels[provider]}?`}
                      description="После отвязки этот способ больше не позволит войти в аккаунт. Сохранённый прогресс останется здесь."
                      confirmLabel="Отвязать способ входа"
                      errorMessage={unlinkError}
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
          <Link to="/sign-in" search={{ returnTo: "/account" }}>
            Войти повторно
          </Link>
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
            errorMessage={deletionError}
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
            errorMessage={providerDeletionError}
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
