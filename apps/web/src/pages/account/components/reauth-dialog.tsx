import { useState } from "react";
import {
  accountApi,
  useAccountSession,
  type Provider,
} from "~/features/account";
import { Button } from "~/shared/components/button";
import { ModalDialog } from "~/shared/components/modal-dialog";
import { PasswordField } from "~/shared/components/password-field";
import { Typography } from "~/shared/components/typography";
import { authProviderNavigation } from "~/shared/lib/auth-provider-navigation";
import { accountPageHelpers } from "../account-page.helpers";
import type { ResumeIntent } from "../model/recent-auth";
import { LoginMethodIcon } from "./login-method-icon";
import styles from "./reauth-dialog.module.css";

type Props = {
  /** The action waiting for the confirmation; null keeps the dialog closed. */
  intent: ResumeIntent | null;
  onClose: () => void;
  /** The password confirmed the sign-in: the action continues here. */
  onConfirmed: (intent: ResumeIntent) => void;
  providers: readonly Provider[];
};

/**
 * Change 227: login methods and deletion change only within ten minutes of a sign-in. Past
 * that, the action asks here: the password right in the dialog, or a linked provider, after
 * which the profile resumes the same action (`/account?resume=…`).
 */
export const ReauthDialog: React.FC<Props> = (props) => {
  const session = useAccountSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = session.account;
  const hasPassword =
    account?.methods.some((method) => method.provider === "email") ?? false;
  const intent = props.intent;
  const only = props.providers.length === 1 ? props.providers[0] : undefined;
  const through = only
    ? `через ${accountPageHelpers.providerLabels[only].replace(" ", "\u00a0")}`
    : "через подключённый сервис";
  let way = `войдите ещё раз ${through}`;
  if (hasPassword)
    way = props.providers.length
      ? `введите пароль или войдите ${through}`
      : "введите пароль";
  // the only linked provider is switched off: say so instead of an empty dialog
  const unavailable = !hasPassword && props.providers.length === 0;
  const close = () => {
    if (pending) return;
    setError(null);
    props.onClose();
  };
  const confirmPassword = async (
    event: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0],
  ) => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    if (!intent || pending || typeof password !== "string" || !password) return;
    setPending(true);
    setError(null);
    try {
      await accountApi.reauthenticate(password, session.csrfToken);
      await session.refresh();
      setPending(false);
      props.onConfirmed(intent);
    } catch (reason) {
      setError(accountPageHelpers.reauthError(reason));
      setPending(false);
    }
  };
  const viaProvider = async (provider: Provider) => {
    if (!intent || pending) return;
    setPending(true);
    setError(null);
    try {
      const url = await accountApi.reauthenticateProvider(
        provider,
        session.csrfToken,
        intent,
      );
      if (!url) throw new Error("Provider URL missing");
      authProviderNavigation.leave(url);
    } catch {
      setError("Не удалось открыть вход через сервис. Попробуйте ещё раз.");
      setPending(false);
    }
  };
  return (
    <ModalDialog
      open={intent !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      busy={pending}
      title="Подтвердите, что это вы"
      description={
        unavailable
          ? "С входа прошло больше 10 минут, а вход через подключённый сервис сейчас недоступен. Попробуйте позже."
          : `С входа прошло больше 10 минут. Чтобы ${intent ? accountPageHelpers.intentAction(intent) : "продолжить"}, ${way}.`
      }
      data-dialog="reauth"
    >
      {hasPassword ? (
        <form
          className={styles.form}
          method="post"
          onSubmit={(event) => {
            void confirmPassword(event);
          }}
        >
          <input
            type="email"
            name="username"
            autoComplete="username"
            aria-hidden="true"
            tabIndex={-1}
            className={styles.username}
            defaultValue={account?.email ?? ""}
            readOnly
          />
          <PasswordField
            name="password"
            label="Пароль"
            autoComplete="current-password"
            maxLength={128}
            required
            disabled={pending}
          />
          {error ? (
            <Typography.Text role="alert" className={styles.error}>
              {error}
            </Typography.Text>
          ) : null}
          <Button type="submit" loading={pending} fullWidth>
            Подтвердить
          </Button>
        </form>
      ) : null}
      {props.providers.length > 0 ? (
        <div className={styles.providers}>
          {hasPassword ? (
            <Typography.Text tone="muted" className={styles.or}>
              или через
            </Typography.Text>
          ) : null}
          {props.providers.map((provider) => (
            <Button
              key={provider}
              type="button"
              hierarchy="soft"
              fullWidth
              disabled={pending}
              iconStart={<LoginMethodIcon provider={provider} size={20} />}
              onClick={() => {
                void viaProvider(provider);
              }}
              data-provider={provider}
            >
              {accountPageHelpers.providerLabels[provider]}
            </Button>
          ))}
        </div>
      ) : null}
      {error && !hasPassword ? (
        <Typography.Text role="alert" className={styles.error}>
          {error}
        </Typography.Text>
      ) : null}
    </ModalDialog>
  );
};
