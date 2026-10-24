import { BookOpen, CircleHelp, ListChecks } from "lucide-react";
import { RestrictionNotice, type AccessTypes } from "~/entities/access";
import {
  billingFormat,
  billingPlans,
  type BillingTypes,
} from "~/entities/billing";
import { ActionLink } from "~/shared/components/action-link";
import { MascotScene } from "~/shared/components/mascot-scene";
import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import type { PaywallTypes } from "../paywall.types";
import styles from "./paywall-gate.module.css";

type Props = {
  access: AccessTypes.State | undefined;
  offer: BillingTypes.Offer | undefined;
  unlocks: PaywallTypes.Unlocks;
  /** «Откройте доступ к сложным задачам». */
  title: string;
  /** One line of why, in the topic's own terms. */
  why: string;
  headingOrder: 2 | 3;
  /** This page's path: sign-in, registration and checkout return here. */
  from: string;
};

const lessonForms = ["урок", "урока", "уроков"] as const;
const questionForms = [
  "вопрос для самопроверки",
  "вопроса для самопроверки",
  "вопросов для самопроверки",
] as const;
const taskForms = [
  "задача с проверкой ответа",
  "задачи с проверкой ответа",
  "задач с проверкой ответа",
] as const;

/**
 * Change 192: the soft paywall under a paid preview. A guest is asked for an
 * account first (only the account owner pays); a signed-in learner sees what
 * full access opens, the action and the price. Copy is honest: the 249 ₽ is
 * named only together with «при оплате за год».
 */
export const PaywallGate: React.FC<Props> = (props) => {
  const { from } = props;
  const guest = props.access?.status === "ready" && !props.access.signedIn;
  const year = billingPlans.find(props.offer, "year");
  const restriction =
    props.access?.status === "ready" ? props.access.restriction : null;
  // Change 198: a suspended or terminated access is explained, never sold again.
  if (restriction && restriction.kind !== "warning")
    return (
      <div className="paywall" data-paywall="restricted">
        <RestrictionNotice
          restriction={restriction}
          headingOrder={props.headingOrder}
        />
      </div>
    );

  if (guest)
    return (
      <section
        className={`paywall ${styles.root}`}
        aria-labelledby="paywall-title"
        data-paywall="guest"
      >
        <div className={styles.head}>
          <div className={styles.copy}>
            <Typography.Title
              order={props.headingOrder}
              id="paywall-title"
              className={styles.title}
            >
              Создайте аккаунт, чтобы продолжить
            </Typography.Title>
            <Typography.Text className={styles.why}>
              Аккаунт бесплатный: в нём сохраняется прогресс, а доступ к
              закрытым урокам можно оформить в любой момент.
            </Typography.Text>
          </div>
          <MascotScene scene="paywall-guest" className={styles.scene} />
        </div>
        <div className={styles.actions}>
          <ActionLink
            presentation="button"
            hierarchy="primary"
            className={styles.cta}
            to="/register"
            search={{ returnTo: from }}
          >
            Создать аккаунт
          </ActionLink>
          <ActionLink
            presentation="button"
            hierarchy="secondary"
            to="/sign-in"
            search={{ returnTo: from }}
          >
            Войти
          </ActionLink>
          <ActionLink hierarchy="text" to="/pricing" search={{ from }}>
            Что входит в доступ
          </ActionLink>
        </div>
      </section>
    );

  const { unlocks } = props;
  return (
    // `paywall` is a global class for the paid-article JSON-LD `cssSelector`
    <section
      className={`paywall ${styles.root}`}
      aria-labelledby="paywall-title"
      data-paywall="member"
    >
      <div className={styles.head}>
        <div className={styles.copy}>
          <Typography.Title
            order={props.headingOrder}
            id="paywall-title"
            className={styles.title}
          >
            {props.title}
          </Typography.Title>
          <Typography.Text className={styles.why}>{props.why}</Typography.Text>
        </div>
        <MascotScene scene="paywall" className={styles.scene} />
      </div>

      <Typography.Text className={styles.question}>
        Что откроется с полным доступом?
      </Typography.Text>
      <ul className={styles.unlocks}>
        {unlocks.lessons.length ? (
          <li className={styles.unlock} data-kind="lessons">
            <BookOpen className={styles.unlockIcon} aria-hidden="true" />
            <span className={styles.unlockText}>
              <b>{unlocks.lessons.length}</b>{" "}
              {`${russianCount.noun(unlocks.lessons.length, lessonForms)} с разбором`}
            </span>
            <ul className={styles.lessons}>
              {unlocks.lessons.map((lesson) => (
                <li key={lesson.title}>
                  <b>{lesson.title}</b>
                  {lesson.lead ? (
                    <span
                      className={styles.lessonLead}
                    >{` — ${lesson.lead}`}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ) : null}
        {unlocks.questions ? (
          <li className={styles.unlock} data-kind="questions">
            <CircleHelp className={styles.unlockIcon} aria-hidden="true" />
            <span className={styles.unlockText}>
              <b>{unlocks.questions}</b>{" "}
              {russianCount.noun(unlocks.questions, questionForms)}
            </span>
          </li>
        ) : null}
        {unlocks.tasks ? (
          <li className={styles.unlock} data-kind="tasks">
            <ListChecks className={styles.unlockIcon} aria-hidden="true" />
            <span className={styles.unlockText}>
              <b>{unlocks.tasks}</b>{" "}
              {russianCount.noun(unlocks.tasks, taskForms)}
              {unlocks.practice ? " и итоговая практика по теме" : null}
            </span>
          </li>
        ) : null}
      </ul>

      <div className={styles.buy}>
        <ActionLink
          presentation="button"
          hierarchy="primary"
          className={styles.cta}
          to="/pricing"
          search={{ from }}
        >
          Получить полный доступ
        </ActionLink>
        {year ? (
          <Typography.Text className={styles.price}>
            <b>{`от ${billingFormat.rub(year.monthlyEquivalentKopecks)} в месяц`}</b>
            при оплате за год
          </Typography.Text>
        ) : null}
        <Typography.Text className={styles.calm}>
          Разовый платёж, без автопродления. Не подойдёт — вернём деньги за
          неиспользованные дни.
        </Typography.Text>
      </div>
    </section>
  );
};
