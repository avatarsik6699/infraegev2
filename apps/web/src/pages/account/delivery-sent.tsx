import { useEffect, useState } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { mailCooldown } from "./model/mail-cooldown";
import styles from "./account-page.module.css";
import type { DeliverySentTypes } from "./delivery-sent.types";

export const DeliverySent: React.FC<DeliverySentTypes.Props> = (props) => {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    mailCooldown.remaining(props.purpose),
  );
  useEffect(
    function deliveryCooldownFx() {
      const timer = setInterval(() => {
        setRemainingSeconds(mailCooldown.remaining(props.purpose));
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    },
    [props.purpose],
  );
  const isVerification = props.purpose === "verification";
  return (
    <section className={styles.delivery} aria-labelledby="delivery-title">
      <Typography.Title order={2} id="delivery-title">
        {isVerification
          ? "Проверьте письмо для подтверждения"
          : "Проверьте письмо для восстановления"}
      </Typography.Title>
      <Typography.Text>
        Мы не сообщаем, возможна ли отправка для этого адреса. Если она
        возможна, письмо придёт на {props.email}. Проверьте также папку «Спам».
      </Typography.Text>
      <Typography.Text tone="muted">
        Ссылка действует ограниченное время и работает один раз.
      </Typography.Text>
      <div className={styles.actions}>
        <Button
          type="button"
          hierarchy="secondary"
          disabled={props.pending || remainingSeconds > 0}
          loading={props.pending}
          onClick={() => {
            void props.onResend().then((shouldStartCooldown) => {
              if (shouldStartCooldown)
                setRemainingSeconds(mailCooldown.remaining(props.purpose));
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
          disabled={props.pending}
          onClick={props.onChangeEmail}
        >
          Указать другой адрес
        </Button>
      </div>
    </section>
  );
};
