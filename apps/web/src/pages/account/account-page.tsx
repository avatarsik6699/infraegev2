import { CircleCheck, CircleAlert, Info } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  accountApi,
  safeReturnTo,
  useAccountSession,
} from "~/features/account";
import { ApiError } from "~/shared/api";
import { ActionLink } from "~/shared/components/action-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { mailCooldown } from "./model/mail-cooldown";
import styles from "./account-page.module.css";
import type { AccountPageTypes } from "./account-page.types";
import { accountPageHelpers } from "./account-page.helpers";
import { DeliverySent } from "./delivery-sent";
import { AccountForm } from "./account-form";
import { ProviderLinks } from "./provider-links";
import { AccountProfile } from "./account-profile";

export const AccountPage: React.FC<AccountPageTypes.Props> = (props) => {
  const session = useAccountSession();
  const refreshSession = session.refresh;
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{
    message: string;
    tone: "success" | "info";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<{
    purpose: AccountPageTypes.DeliveryPurpose;
    email: string;
  } | null>(null);
  const [invalidResetToken, setInvalidResetToken] = useState(false);
  const [formCooldown, setFormCooldown] = useState(0);
  const destination = safeReturnTo(props.returnTo);
  useEffect(
    function formCooldownFx() {
      if (props.mode !== "register" && props.mode !== "recovery") return;
      const purpose = props.mode === "register" ? "verification" : "recovery";
      const update = () => setFormCooldown(mailCooldown.remaining(purpose));
      update();
      const timer = setInterval(update, 1000);
      return () => clearInterval(timer);
    },
    [props.mode],
  );
  useEffect(
    function verifyEmailFx() {
      if (props.mode !== "verify" || !props.token) return;
      let active = true;
      void accountApi.verifyEmail(props.token).then(
        async () => {
          if (!active) return;
          await refreshSession();
          if (active)
            setNotice({ message: "Почта подтверждена.", tone: "success" });
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
    },
    [props.mode, props.token, refreshSession],
  );
  const submit = async (
    submittedMode: AccountPageTypes.Mode,
    event: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0],
  ) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setNotice(null);
    const data = new FormData(event.currentTarget);
    const email = accountPageHelpers.inputValue(data, "email");
    const password = accountPageHelpers.inputValue(data, "password");
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
          if (!props.token) return;
          await accountApi.confirmPasswordReset(props.token, password);
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
        setError(accountPageHelpers.signInError(reason));
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
        setError(accountPageHelpers.registrationError(reason));
      } else {
        setError(accountPageHelpers.deliveryError(reason));
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
      setNotice({
        message:
          "Запрос отправлен. Если отправка возможна, проверьте почту и папку «Спам».",
        tone: "info",
      });
      return true;
    } catch (reason) {
      setError(accountPageHelpers.deliveryError(reason));
      if (reason instanceof ApiError && reason.status === 429)
        mailCooldown.markSent(delivery.purpose);
      return reason instanceof ApiError && reason.status === 429;
    } finally {
      setPending(false);
    }
  };
  const titles: Record<AccountPageTypes.Mode, string> = {
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
        data-profile={props.mode === "profile" || undefined}
      >
        <section
          className={styles.panel}
          data-auth-surface={props.mode !== "profile" || undefined}
          aria-label={props.mode === "profile" ? "Аккаунт" : undefined}
          aria-labelledby={
            props.mode === "profile" ? undefined : "account-title"
          }
        >
          {props.mode !== "profile" ? (
            <header className={styles.intro}>
              <Typography.Title order={1} id="account-title">
                {titles[props.mode]}
              </Typography.Title>
              {props.mode === "sign-in" ? (
                <Typography.Text tone="muted">
                  Прогресс будет сохраняться в аккаунте.
                </Typography.Text>
              ) : null}
            </header>
          ) : null}
          {notice ? (
            <Typography.Text
              className={cssUtils.cx(styles.notice, styles.feedbackMessage)}
              data-feedback-tone={notice.tone}
              role="status"
            >
              {notice.tone === "success" ? (
                <CircleCheck aria-hidden="true" size={18} strokeWidth={1.75} />
              ) : (
                <Info aria-hidden="true" size={18} strokeWidth={1.75} />
              )}
              <span>{notice.message}</span>
            </Typography.Text>
          ) : null}
          {error ? (
            <Typography.Text
              className={cssUtils.cx(styles.error, styles.feedbackMessage)}
              role="alert"
            >
              <CircleAlert aria-hidden="true" size={18} strokeWidth={1.75} />
              <span>{error}</span>
            </Typography.Text>
          ) : null}
          {props.mode === "profile" ? (
            <AccountProfile
              practiceSummary={props.practiceSummary ?? null}
              enabledProviders={props.enabledProviders ?? []}
            />
          ) : null}
          {props.mode === "verify" && props.token ? (
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
          {props.mode !== "profile" && !delivery && props.mode !== "verify" ? (
            <AccountForm
              mode={invalidResetToken ? "recovery" : props.mode}
              token={props.token}
              pending={pending}
              cooldown={formCooldown}
              onSubmit={submit}
            />
          ) : null}
          {props.mode === "verify" && props.token && notice ? (
            <ActionLink to={session.account ? "/account" : "/sign-in"}>
              {session.account ? "Вернуться к аккаунту" : "Войти"}
            </ActionLink>
          ) : null}
          {props.mode === "verify" && props.token && error ? (
            <ActionLink to="/register">Начать регистрацию заново</ActionLink>
          ) : null}
          {props.mode === "sign-in" ? (
            <div className={styles.secondary}>
              <ActionLink
                presentation="inline"
                icon="none"
                to="/register"
                search={{ returnTo: destination }}
              >
                Создать аккаунт
              </ActionLink>
              <ActionLink
                presentation="inline"
                icon="none"
                to="/password-reset"
                search={{ token: undefined, returnTo: destination }}
              >
                Не помню пароль
              </ActionLink>
            </div>
          ) : null}
          {props.mode === "sign-in" || props.mode === "register" ? (
            <ProviderLinks
              mode={props.mode}
              returnTo={destination}
              enabledProviders={props.enabledProviders ?? []}
            />
          ) : null}
        </section>
      </PageContainer>
      <PublicFooter />
    </div>
  );
};
