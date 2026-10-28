import { useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  billingApi,
  billingFormat,
  billingPlans,
  CheckoutError,
  type BillingTypes,
  type CheckoutFailure,
} from "~/entities/billing";
import { useAccountSession } from "~/features/account";
import { accountIdentity } from "~/shared/lib/account-identity";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { PageContainer } from "~/shared/components/page-container";
import { ProfileAvatar } from "~/shared/components/profile-avatar";
import { Typography } from "~/shared/components/typography";
import { paymentNavigation } from "~/shared/lib/payment-navigation";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import type { CheckoutPageTypes } from "./checkout-page.types";
import styles from "./checkout-page.module.css";

const DAY_MS = 24 * 60 * 60 * 1000;

const failures: Record<CheckoutFailure, React.ReactNode> = {
  offer_outdated:
    "Условия оферты обновились. Обновите страницу, чтобы увидеть новую версию.",
  checkout_paused: "Оплата временно недоступна. Попробуйте позже.",
  signed_out: "Сессия закончилась. Войдите снова и повторите оплату.",
  unavailable: "Не удалось начать оплату. Проверьте подключение и повторите.",
};

/**
 * Change 192 (F1, approved): one «Оплатить», no checkboxes; the small line
 * under it is the acceptance of the offer (ГК ст. 438), and the server
 * records its version. Only the account owner pays, so a guest signs in first.
 */
export const CheckoutPage: React.FC<CheckoutPageTypes.Props> = (props) => {
  const session = useAccountSession();
  const here = useRouterState({ select: (state) => state.location.href });
  const [planId, setPlanId] = useState<BillingTypes.PlanId>(props.plan);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<CheckoutFailure | null>(null);
  // One key per page visit and plan: a double click never pays twice.
  const keys = useMemo(
    () => ({ month: crypto.randomUUID(), year: crypto.randomUUID() }),
    [],
  );
  const plan = billingPlans.find(props.offer, planId);
  const until = accessUntil(props.access, plan);

  const pay = async () => {
    if (!plan) return;
    setPending(true);
    setFailure(null);
    try {
      const checkout = await billingApi.checkout({
        plan: plan.id,
        offerVersion: props.offer.offerVersion,
        returnPath: props.from ?? null,
        idempotencyKey: keys[plan.id],
        csrfToken: session.csrfToken,
      });
      paymentNavigation.leave(checkout.redirectUrl);
    } catch (reason) {
      setFailure(reason instanceof CheckoutError ? reason.code : "unavailable");
      setPending(false);
    }
  };

  let body: React.ReactNode;
  if (session.status === "loading")
    body = <Typography.Text role="status">Загружаем аккаунт…</Typography.Text>;
  else if (!session.account)
    body = (
      <div className={styles.guest} data-checkout-guest>
        <Typography.Text>
          Доступ оформляется на аккаунт: войдите или создайте его, и мы вернём
          вас сюда.
        </Typography.Text>
        <div className={styles.actions}>
          <ActionLink
            presentation="button"
            hierarchy="primary"
            to="/sign-in"
            search={{ returnTo: here }}
          >
            Войти
          </ActionLink>
          <ActionLink
            presentation="button"
            hierarchy="secondary"
            to="/register"
            search={{ returnTo: here }}
          >
            Создать аккаунт
          </ActionLink>
        </div>
      </div>
    );
  else
    body = (
      <>
        {/* Change 228: the same avatar as the header; access belongs to the account, not to
            one way of signing in, and the receipt address is said up front */}
        <div className={styles.account} data-checkout-account>
          <ProfileAvatar initial={accountIdentity.initial(session.account)} />
          <div className={styles.accountCopy}>
            <Typography.Text className={styles.accountName}>
              {session.account.email
                ? `Доступ откроется для аккаунта ${session.account.email}`
                : "Доступ откроется для вашего аккаунта"}
            </Typography.Text>
            <Typography.Text className={styles.accountText}>
              {`Войти в него можно: ${russianList(accountIdentity.methods(session.account))}. `}
              {/* Change 230: Robokassa refuses an address with «+», so the
                  link leaves it out and the buyer types one there */}
              {session.account.email && !session.account.email.includes("+")
                ? "Чек придёт на этот адрес."
                : "Чек придёт на почту, которую вы укажете на странице оплаты."}
            </Typography.Text>
          </div>
        </div>

        <fieldset className={styles.plans}>
          <legend className={styles.visuallyHidden}>Срок доступа</legend>
          {props.offer.plans.map((item) => (
            <label
              key={item.id}
              className={styles.option}
              data-checked={item.id === planId || undefined}
            >
              <input
                type="radio"
                name="plan"
                value={item.id}
                checked={item.id === planId}
                onChange={() => {
                  setPlanId(item.id);
                  setFailure(null);
                }}
                className={styles.radio}
              />
              <span className={styles.optionName}>
                {item.id === "year" ? "Год" : "Месяц"}
              </span>
              <span className={styles.optionPrice}>
                {billingFormat.rub(item.priceKopecks)}
              </span>
              <span className={styles.optionNote}>
                {item.id === "year"
                  ? `${String(item.days)} дней · ≈ ${billingFormat.rub(item.monthlyEquivalentKopecks)} в месяц`
                  : `${String(item.days)} дней`}
              </span>
            </label>
          ))}
        </fieldset>

        {plan ? (
          <dl className={styles.summary}>
            <div>
              <dt>Доступ до</dt>
              <dd>{billingFormat.date(until.toISOString())}</dd>
            </div>
            <div className={styles.total}>
              <dt>К оплате</dt>
              <dd>{billingFormat.rub(plan.priceKopecks)}</dd>
            </div>
          </dl>
        ) : null}

        {failure ? (
          <Typography.Text className={styles.error} role="alert">
            {failures[failure]}
          </Typography.Text>
        ) : null}

        <Button
          type="button"
          hierarchy="primary"
          fullWidth
          loading={pending}
          className={styles.pay}
          onClick={() => {
            void pay();
          }}
          data-checkout-pay
        >
          {plan
            ? `Оплатить ${billingFormat.rub(plan.priceKopecks)}`
            : "Оплатить"}
        </Button>
        <Typography.Text className={styles.smallPrint}>
          Нажимая «Оплатить», вы принимаете условия{" "}
          <ActionLink
            presentation="inline"
            icon="none"
            hierarchy="text"
            to="/oferta"
          >
            оферты
          </ActionLink>
          . Без автопродления.
        </Typography.Text>
      </>
    );

  return (
    <div className={styles.page}>
      <PublicHeader />
      <main id="main-content" data-checkout-page>
        <PageContainer component="div" className={styles.content}>
          <Typography.Title order={1} className={styles.title}>
            Оформление доступа
          </Typography.Title>

          {body}
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};

/** «VK ID и Яндекс ID», «почта и пароль, VK ID и Яндекс ID». */
function russianList(items: readonly string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} и ${items.at(-1) ?? ""}`;
}

/** A new pass starts when the current one ends (SPEC §2.2), otherwise now. */
function accessUntil(
  access: CheckoutPageTypes.Props["access"],
  plan: BillingTypes.Plan | undefined,
): Date {
  const now = Date.now();
  const current =
    access?.status === "ready" && access.granted && access.until
      ? Date.parse(access.until)
      : now;
  return new Date(Math.max(now, current) + (plan?.days ?? 0) * DAY_MS);
}
