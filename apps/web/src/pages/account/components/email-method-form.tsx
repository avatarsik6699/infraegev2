import { useEffect, useState } from "react";
import { accountApi, useAccountSession } from "~/features/account";
import { ApiError } from "~/shared/api";
import { Button } from "~/shared/components/button";
import { Field } from "~/shared/components/field";
import { PasswordField } from "~/shared/components/password-field";
import { Typography } from "~/shared/components/typography";
import { mailCooldown } from "../model/mail-cooldown";
import styles from "../account-page.module.css";

type Props = { pendingEmail: string | null };

export const EmailMethodForm: React.FC<Props> = (props) => {
  const session = useAccountSession();
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState(props.pendingEmail ?? "");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    const update = () => setCooldown(mailCooldown.remaining("verification"));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = data.get("password");
    if (typeof password !== "string") return;
    setPending(true);
    setNotice(null);
    setError(null);
    try {
      await accountApi.addEmailMethod(email, password, session.csrfToken);
      mailCooldown.markSent("verification");
      setCooldown(mailCooldown.remaining("verification"));
      await session.refresh();
      form.reset();
      setNotice(
        "Если адрес доступен, письмо со ссылкой придёт на него. Проверьте также папку «Спам». После подтверждения станет доступен вход по паролю.",
      );
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 403) {
        setError(
          "Подтвердите вход через подключённый сервис выше и повторите действие.",
        );
      } else if (reason instanceof ApiError && reason.status === 409) {
        setError(
          "Способ входа уже добавлен. Обновите страницу и проверьте аккаунт.",
        );
      } else if (reason instanceof ApiError && reason.status === 429) {
        setError("Лимит писем достигнут. Проверьте почту и попробуйте позже.");
      } else if (reason instanceof ApiError && reason.status === 503) {
        setError("Почта временно недоступна. Попробуйте позже.");
      } else {
        setError(
          "Не удалось добавить почту. Проверьте подключение и попробуйте ещё раз.",
        );
      }
    } finally {
      setPending(false);
    }
  };
  return (
    <section
      className={styles.emailMethod}
      aria-labelledby="email-method-title"
    >
      <Typography.Title order={3} id="email-method-title">
        {props.pendingEmail
          ? "Почта ожидает подтверждения"
          : "Добавить почту и пароль"}
      </Typography.Title>
      <Typography.Text tone="muted">
        {props.pendingEmail
          ? `Адрес ${props.pendingEmail} пока не подтверждён. До подтверждения вход по паролю недоступен. Можно исправить адрес ниже; прежняя ссылка тогда перестанет работать.`
          : "Это запасной способ входа в тот же аккаунт. Совпадение адреса с другим аккаунтом не объединяет их."}
      </Typography.Text>
      <form
        className={styles.form}
        method="post"
        onSubmit={(event) => {
          void submit(event);
        }}
      >
        <Field
          name="email"
          type="email"
          autoComplete="email"
          label="Электронная почта"
          placeholder="name@example.ru"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={pending}
          required
        />
        <PasswordField
          name="password"
          autoComplete="new-password"
          label="Новый пароль"
          placeholder="Придумайте пароль"
          help="Не менее 12 символов. Не используйте пароль от другого сайта."
          minLength={12}
          maxLength={128}
          disabled={pending}
          required
        />
        <div className={styles.actions}>
          <Button type="submit" loading={pending}>
            {props.pendingEmail ? "Обновить адрес и пароль" : "Добавить почту"}
          </Button>
        </div>
      </form>
      {props.pendingEmail ? (
        <div className={styles.actions}>
          <Button
            type="button"
            hierarchy="secondary"
            disabled={pending || cooldown > 0}
            onClick={() => {
              setPending(true);
              setError(null);
              void accountApi
                .requestVerification(props.pendingEmail!)
                .then(
                  () => {
                    mailCooldown.markSent("verification");
                    setCooldown(mailCooldown.remaining("verification"));
                    setNotice(
                      "Если отправка возможна, проверьте почту и папку «Спам».",
                    );
                  },
                  (reason: unknown) => {
                    setError(
                      reason instanceof ApiError && reason.status === 429
                        ? "Лимит писем достигнут. Попробуйте позже."
                        : "Не удалось запросить письмо. Попробуйте позже.",
                    );
                  },
                )
                .finally(() => setPending(false));
            }}
          >
            {cooldown > 0
              ? `Отправить повторно через ${cooldown} с`
              : "Отправить письмо ещё раз"}
          </Button>
        </div>
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
    </section>
  );
};
