import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { Field } from "~/shared/components/field";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { PasswordField } from "~/shared/components/password-field";
import styles from "./account-page.module.css";
import type { AccountFormTypes } from "./account-form.types";
import { accountPageHelpers } from "./account-page.helpers";

export const AccountForm: React.FC<AccountFormTypes.Props> = (props) => {
  const enhanced = useIsEnhanced();
  if (props.mode === "new-password" && !props.token)
    return (
      <>
        <Typography.Text className={styles.error} role="alert">
          Ссылка для восстановления неполная. Запросите новую.
        </Typography.Text>
        <AccountForm
          mode="recovery"
          pending={props.pending}
          cooldown={props.cooldown}
          onSubmit={props.onSubmit}
        />
      </>
    );
  const email = props.mode !== "new-password";
  const password =
    props.mode === "sign-in" ||
    props.mode === "register" ||
    props.mode === "new-password";
  let autocomplete: "new-password" | "current-password" = "current-password";
  if (props.mode === "new-password" || props.mode === "register")
    autocomplete = "new-password";
  return (
    <form
      className={styles.form}
      data-enhanced={enhanced || undefined}
      method="post"
      onSubmit={(event) => {
        void props.onSubmit(props.mode, event);
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
      {props.mode === "new-password" ? (
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
            props.mode === "register" || props.mode === "new-password"
              ? "Придумайте пароль"
              : "Введите пароль"
          }
          help={
            props.mode === "register" || props.mode === "new-password"
              ? "Не менее 12 символов. Не используйте пароль от другого сайта."
              : undefined
          }
          required
          minLength={props.mode === "sign-in" ? 1 : 12}
        />
      ) : null}
      {props.mode === "register" ? (
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
            <ActionLink presentation="inline" icon="none" to="/consent">
              согласие на обработку персональных данных
            </ActionLink>
            . Сведения о работе сайта — в{" "}
            <ActionLink presentation="inline" icon="none" to="/privacy">
              политике обработки данных
            </ActionLink>
            .
          </label>
        </div>
      ) : null}
      <div className={styles.actions}>
        <Button
          type="submit"
          loading={props.pending}
          disabled={
            !enhanced ||
            (props.cooldown > 0 &&
              (props.mode === "register" || props.mode === "recovery"))
          }
        >
          {props.cooldown > 0 &&
          (props.mode === "register" || props.mode === "recovery")
            ? `Повторить через ${props.cooldown} с`
            : accountPageHelpers.formLabel(props.mode)}
        </Button>
        {props.mode !== "sign-in" ? (
          <ActionLink to="/sign-in">Уже есть аккаунт</ActionLink>
        ) : null}
      </div>
    </form>
  );
};
