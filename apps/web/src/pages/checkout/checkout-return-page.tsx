import { billingFormat } from "~/entities/billing";
import { ActionLink } from "~/shared/components/action-link";
import { MascotScene } from "~/shared/components/mascot-scene";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { usePaymentStatus } from "./model/use-payment-status";
import styles from "./checkout-return-page.module.css";

type Props = { paymentId?: string };

/**
 * Change 192 (F1): the page the provider returns to. Access opens only from
 * the API's own status, never from the query string; the mascot celebrates
 * only a confirmed payment — the one place it does.
 */
export const CheckoutReturnPage: React.FC<Props> = (props) => {
  const watch = usePaymentStatus(props.paymentId);
  const payment = watch.state === "error" ? undefined : watch.payment;
  const back = payment?.returnPath ?? "/";

  let body: React.ReactNode;
  if (watch.state === "done" && watch.payment.status === "succeeded") {
    body = (
      <div className={styles.done} data-payment-state="succeeded">
        <div className={styles.copy}>
          <Typography.Title order={1} className={styles.title}>
            Доступ открыт
          </Typography.Title>
          {watch.payment.accessUntil ? (
            <Typography.Text className={styles.text}>
              {`Все уроки и задачи доступны до ${billingFormat.date(watch.payment.accessUntil)}.`}
            </Typography.Text>
          ) : null}
          {/* Change 232: an account without an address, or with «+», gives
              its receipt address at Robokassa (Change 230) */}
          <Typography.Text className={styles.note}>
            Чек придёт на почту, указанную при оплате.
          </Typography.Text>
          <div className={styles.actions}>
            <ActionLink presentation="button" hierarchy="primary" to={back}>
              {back === "/" ? "На главную" : "Вернуться к уроку"}
            </ActionLink>
            <ActionLink
              hierarchy="text"
              to="/account"
              search={{ tab: "access" }}
            >
              Раздел «Доступ»
            </ActionLink>
          </div>
        </div>
        <MascotScene scene="access-open" className={styles.scene} />
      </div>
    );
  } else if (watch.state === "done") {
    body = (
      <div className={styles.copy} data-payment-state={watch.payment.status}>
        <Typography.Title order={1} className={styles.title}>
          {watch.payment.status === "refunded"
            ? "Платёж возвращён"
            : "Оплата не прошла"}
        </Typography.Title>
        <Typography.Text className={styles.text}>
          {watch.payment.status === "refunded"
            ? "Деньги вернутся на карту в обычный для банка срок."
            : "Деньги не списаны. Можно попробовать ещё раз или выбрать другой способ оплаты на странице Robokassa."}
        </Typography.Text>
        <div className={styles.actions}>
          <ActionLink
            presentation="button"
            hierarchy="primary"
            to="/subscribe"
            search={{ plan: watch.payment.plan, from: back }}
          >
            Попробовать ещё раз
          </ActionLink>
        </div>
      </div>
    );
  } else if (watch.state === "error") {
    body = (
      <div className={styles.copy} data-payment-state="unknown">
        <Typography.Title order={1} className={styles.title}>
          Не удалось проверить оплату
        </Typography.Title>
        <Typography.Text className={styles.text}>
          Если деньги списаны, доступ откроется сам в течение часа. Состояние
          платежей видно в разделе «Доступ» профиля.
        </Typography.Text>
        <div className={styles.actions}>
          <ActionLink
            presentation="button"
            hierarchy="secondary"
            to="/account"
            search={{ tab: "access" }}
          >
            Открыть профиль
          </ActionLink>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={styles.copy} data-payment-state="pending">
        <Typography.Title order={1} className={styles.title}>
          Проверяем оплату…
        </Typography.Title>
        <Typography.Text className={styles.text} role="status">
          {watch.state === "slow"
            ? "Банк отвечает дольше обычного. Страницу можно закрыть: доступ откроется сам, как только платёж подтвердится, и придёт письмо."
            : "Обычно это занимает несколько секунд."}
        </Typography.Text>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PublicHeader />
      <main id="main-content" data-checkout-return>
        <PageContainer component="div" className={styles.content}>
          {body}
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
