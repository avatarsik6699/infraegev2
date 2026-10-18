import { useEffect, useState } from "react";
import type { AccessTypes } from "~/entities/access";
import {
  billingApi,
  billingFormat,
  type BillingTypes,
} from "~/entities/billing";
import { ActionLink } from "~/shared/components/action-link";
import { ExternalLink } from "~/shared/components/external-link";
import { Progress } from "~/shared/components/progress";
import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import styles from "./account-access.module.css";

const DAY_MS = 24 * 60 * 60 * 1000;
const dayForms = ["день", "дня", "дней"] as const;
const statusLabels: Record<BillingTypes.PaymentStatus, string> = {
  created: "Создан",
  pending: "Проверяется",
  succeeded: "Оплачен",
  failed: "Не прошёл",
  refunded: "Возвращён",
};

type Props = { access: AccessTypes.State | undefined };

/**
 * Change 192 (F1): the profile's «Доступ» — how long access runs, a way to
 * extend it, and the payments with their receipts (Робочеки mail them too).
 */
export const AccountAccess: React.FC<Props> = (props) => {
  const [payments, setPayments] = useState<
    readonly BillingTypes.Payment[] | "loading" | "error"
  >("loading");
  useEffect(function loadPaymentsFx() {
    let stopped = false;
    billingApi.payments().then(
      (list) => {
        if (!stopped) setPayments(list);
      },
      () => {
        if (!stopped) setPayments("error");
      },
    );
    return () => {
      stopped = true;
    };
  }, []);

  // the moment the tab opened; days left are counted from it
  const [now] = useState(() => Date.now());
  const access = props.access?.status === "ready" ? props.access : undefined;
  const until = access?.granted && access.paywall ? access.until : null;
  const list = typeof payments === "string" ? [] : payments;
  const current = list.find(
    (payment) =>
      payment.status === "succeeded" &&
      payment.accessUntil === until &&
      payment.accessFrom,
  );
  const left = until
    ? Math.max(0, Math.ceil((Date.parse(until) - now) / DAY_MS))
    : 0;
  const span =
    current?.accessFrom && current.accessUntil
      ? Math.round(
          (Date.parse(current.accessUntil) - Date.parse(current.accessFrom)) /
            DAY_MS,
        )
      : left;

  return (
    <section
      className={styles.root}
      aria-labelledby="access-title"
      data-account-access
    >
      <Typography.Title
        order={2}
        id="access-title"
        className={styles.visuallyHidden}
      >
        Доступ
      </Typography.Title>
      <div className={styles.now}>
        <div className={styles.nowCopy}>
          <Typography.Title order={3} className={styles.nowTitle}>
            {until
              ? `Доступ открыт до ${billingFormat.date(until)}`
              : "Сейчас открыты бесплатные материалы"}
          </Typography.Title>
          <Typography.Text className={styles.nowText}>
            {until
              ? `Осталось ${russianCount.of(left, dayForms)}. Повторная покупка продлит срок с этой даты.`
              : "Полный доступ открывает остальные уроки тем ЕГЭ, их задачи и вопросы для самопроверки."}
          </Typography.Text>
          {until && span > 0 ? (
            <Progress
              className={styles.meter}
              value={left}
              max={span}
              label="Осталось дней доступа"
              valueText={`${String(left)} из ${String(span)}`}
            />
          ) : null}
        </div>
        <ActionLink
          presentation="button"
          hierarchy={until ? "secondary" : "primary"}
          to="/pricing"
        >
          {until ? "Продлить" : "Посмотреть тарифы"}
        </ActionLink>
      </div>

      <PaymentHistory payments={payments} />

      <Typography.Text className={styles.note}>
        Вернуть деньги за неиспользованные дни можно по{" "}
        <ActionLink
          presentation="inline"
          icon="none"
          hierarchy="text"
          to="/vozvrat"
        >
          правилам возврата
        </ActionLink>
        .
      </Typography.Text>
    </section>
  );
};

const PaymentHistory: React.FC<{
  payments: readonly BillingTypes.Payment[] | "loading" | "error";
}> = (props) => {
  if (props.payments === "loading")
    return (
      <Typography.Text role="status" className={styles.note}>
        Загружаем платежи…
      </Typography.Text>
    );
  if (props.payments === "error")
    return (
      <Typography.Text role="alert" className={styles.note}>
        Не удалось загрузить платежи. Обновите страницу.
      </Typography.Text>
    );
  if (!props.payments.length)
    return (
      <Typography.Text className={styles.note}>
        Платежей пока нет.
      </Typography.Text>
    );
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className={styles.visuallyHidden}>Платежи</caption>
        <thead>
          <tr>
            <th scope="col">Дата</th>
            <th scope="col">Тариф</th>
            <th scope="col">Сумма</th>
            <th scope="col">Период</th>
            <th scope="col">Чек</th>
          </tr>
        </thead>
        <tbody>
          {props.payments.map((payment) => (
            <tr key={payment.id} data-payment-status={payment.status}>
              <td>
                {billingFormat.shortDate(payment.paidAt ?? payment.createdAt)}
              </td>
              <td>
                {payment.plan === "year" ? "Год" : "Месяц"}
                {payment.status === "succeeded" ? null : (
                  <span className={styles.status}>
                    {` · ${statusLabels[payment.status]}`}
                  </span>
                )}
              </td>
              <td className={styles.number}>
                {billingFormat.rub(payment.amountKopecks)}
              </td>
              <td>
                {payment.accessFrom && payment.accessUntil
                  ? `${billingFormat.shortDate(payment.accessFrom)} – ${billingFormat.shortDate(payment.accessUntil)}`
                  : "—"}
              </td>
              <td>
                {payment.receiptUrl ? (
                  <ExternalLink href={payment.receiptUrl}>Открыть</ExternalLink>
                ) : (
                  <span className={styles.status}>в письме</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
