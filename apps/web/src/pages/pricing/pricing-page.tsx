import { BookOpen, Calendar, CalendarRange, Check, Minus } from "lucide-react";
import { billingFormat, billingPlans } from "~/entities/billing";
import { ActionLink } from "~/shared/components/action-link";
import { MascotScene } from "~/shared/components/mascot-scene";
import { PageContainer } from "~/shared/components/page-container";
import { PageHead } from "~/shared/components/page-head";
import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import patterns from "~/shared/styles/patterns.module.css";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { freeScope } from "./model/free-scope";
import type { PricingPageTypes } from "./pricing-page.types";
import styles from "./pricing-page.module.css";

const lessonForms = ["урок", "урока", "уроков"] as const;
const lessonWord = (count: number) => russianCount.noun(count, lessonForms);

/**
 * Change 192 (F1, approved v15): three plan cards in the home path-tile layout,
 * monochrome; the month plan in the centre is the one to try first — orange
 * chip and ticks, the main action and an animated frame. Prices come from the
 * API; the year's crossed-out sum is twelve real month prices.
 */
export const PricingPage: React.FC<PricingPageTypes.Props> = (props) => {
  const month = billingPlans.find(props.offer, "month");
  const year = billingPlans.find(props.offer, "year");
  const scope = freeScope();
  const granted =
    props.access?.status === "ready" &&
    props.access.granted &&
    props.access.paywall;
  const until = props.access?.status === "ready" ? props.access.until : null;
  const plan = (id: "month" | "year") => ({ plan: id, from: props.from });
  const freeItems = [
    ...scope.freeCourses.map((course) => `Курс ${course.title} целиком`),
    ...scope.partlyFreeCourses.map(
      (course) =>
        `${course.title}: первые ${String(course.freeLessons)} ${lessonWord(course.freeLessons)}`,
    ),
    `Темы ${scope.freeTopicNumbers} целиком`,
    "Первые уроки остальных тем",
    "Банк задач с проверкой",
  ];
  const paidItems = [
    "Все уроки тем ЕГЭ и «Практика и итог»",
    "Задачи и вопросы для самопроверки",
    ...scope.partlyFreeCourses.map((course) => `Курс ${course.title} целиком`),
  ];

  return (
    <div className={styles.page}>
      <PublicHeader />
      <main id="main-content" data-pricing-page>
        <PageHead
          className={styles.head}
          title={
            <>
              Все уроки ЕГЭ —{" "}
              <span className={styles.highlight}>одним доступом</span>
            </>
          }
          lead="Python, первые уроки Excel и половина тем открыты всем. Доступ открывает остальные уроки, их задачи и вопросы для самопроверки."
          aside={<MascotScene scene="pricing" className={styles.scene} />}
        />
        <PageContainer component="div" className={styles.content}>
          {granted && until ? (
            <Typography.Text className={styles.current} role="status">
              {`Доступ открыт до ${billingFormat.date(until)}. Новая покупка продлит его с этой даты.`}
            </Typography.Text>
          ) : null}

          <div className={styles.plans} data-plans>
            <article className={styles.plan} data-look="free">
              <div className={styles.top}>
                <span className={styles.chip}>
                  <BookOpen aria-hidden="true" />
                </span>
                <Typography.Title order={2} className={styles.name}>
                  Free
                </Typography.Title>
                {granted ? null : <span className={styles.pill}>Ваш план</span>}
                <Typography.Text className={styles.sub}>
                  Без оплаты и без срока
                </Typography.Text>
              </div>
              <Typography.Text className={styles.desc}>
                Чтобы начать и попробовать, как устроены уроки.
              </Typography.Text>
              <div className={styles.amount}>
                <span className={styles.now}>0&nbsp;₽</span>
              </div>
              <span className={styles.soft}>
                {granted ? "Всегда открыто" : "Уже действует"}
              </span>
              <span className={styles.plus}>Что входит</span>
              <PlanList items={freeItems} />
              <BookOpen className={styles.mark} aria-hidden="true" />
            </article>

            {month ? (
              <article
                className={styles.plan}
                data-look="month"
                data-plan="month"
              >
                <div className={styles.top}>
                  <span className={styles.chip}>
                    <Calendar aria-hidden="true" />
                  </span>
                  <Typography.Title order={2} className={styles.name}>
                    Месяц
                  </Typography.Title>
                  <span className={styles.pill} data-tone="start">
                    Для начала
                  </span>
                  <Typography.Text className={styles.sub}>
                    {`${String(month.days)} дней полного доступа`}
                  </Typography.Text>
                </div>
                <Typography.Text className={styles.desc}>
                  Попробуйте все уроки и задачи. Подойдёт — продлите или
                  возьмите год.
                </Typography.Text>
                <div className={styles.amount}>
                  <span className={styles.now}>
                    {billingFormat.rub(month.priceKopecks)}
                    <small>{` за ${String(month.days)} дней`}</small>
                  </span>
                </div>
                <ActionLink
                  presentation="button"
                  hierarchy="primary"
                  className={styles.cta}
                  to="/subscribe"
                  search={plan("month")}
                >
                  {granted ? "Продлить на месяц" : "Выбрать месяц"}
                </ActionLink>
                <span className={styles.plus}>Всё из Free, плюс</span>
                <PlanList items={[...paidItems, "Без автопродления"]} />
                <Calendar className={styles.mark} aria-hidden="true" />
              </article>
            ) : null}

            {year ? (
              <article
                className={styles.plan}
                data-look="year"
                data-plan="year"
              >
                <div className={styles.top}>
                  <span className={styles.chip}>
                    <CalendarRange aria-hidden="true" />
                  </span>
                  <Typography.Title order={2} className={styles.name}>
                    Год
                  </Typography.Title>
                  <span className={styles.pill}>Выгоднее</span>
                  <Typography.Text className={styles.sub}>
                    {`${String(year.days)} дней, весь сезон`}
                  </Typography.Text>
                </div>
                <Typography.Text className={styles.desc}>
                  Если уже решили готовиться с нами до экзамена.
                </Typography.Text>
                <div className={styles.amount}>
                  <span className={styles.now}>
                    {billingFormat.rub(year.priceKopecks)}
                  </span>
                  <span className={styles.was}>
                    <s>{billingFormat.rub(year.monthsPriceKopecks)}</s>
                    <span className={styles.save}>
                      {`−${String(billingFormat.savingPercent(year))}%`}
                    </span>
                  </span>
                  <span className={styles.per}>
                    {`${billingFormat.rub(year.monthlyEquivalentKopecks)} в месяц`}
                  </span>
                </div>
                <ActionLink
                  presentation="button"
                  hierarchy="secondary"
                  to="/subscribe"
                  search={plan("year")}
                >
                  {granted ? "Продлить на год" : "Выбрать год"}
                </ActionLink>
                <span className={styles.plus}>Всё из Free, плюс</span>
                <PlanList
                  items={[...paidItems, "Один платёж, без автопродления"]}
                />
                <CalendarRange className={styles.mark} aria-hidden="true" />
              </article>
            ) : null}
          </div>

          <section className={styles.compare} aria-labelledby="compare-title">
            <Typography.Title order={2} id="compare-title">
              Сравнение
            </Typography.Title>
            <Typography.Text className={styles.compareLead}>
              Месяц и Год открывают одно и то же; отличаются только срок и цена.
            </Typography.Text>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className={patterns.visuallyHidden}>Что</span>
                    </th>
                    <th scope="col">Free</th>
                    <th scope="col">Месяц и Год</th>
                  </tr>
                </thead>
                <tbody>
                  <CompareRow
                    what="Теория тем ЕГЭ"
                    free={`${String(scope.freeTopicCount)} тем целиком, в остальных — первые уроки`}
                    paid="Все уроки"
                  />
                  <CompareRow
                    what="Задачи с проверкой в уроках"
                    free="В открытых уроках"
                    paid="Во всех уроках"
                  />
                  <CompareRow
                    what="Вопросы для самопроверки"
                    free="В открытых уроках"
                    paid="Во всех уроках"
                  />
                  <CompareRow
                    what="«Практика и итог» по темам"
                    free="В открытых темах"
                    freePartial
                    paid="По всем темам"
                  />
                  {scope.freeCourses.map((course) => (
                    <CompareRow
                      key={course.title}
                      what={`Курс ${course.title}`}
                      free="Целиком"
                      paid="Целиком"
                    />
                  ))}
                  {scope.partlyFreeCourses.map((course) => (
                    <CompareRow
                      key={course.title}
                      what={`Курс ${course.title}`}
                      free={`Первые ${String(course.freeLessons)} ${lessonWord(course.freeLessons)}`}
                      paid="Целиком"
                    />
                  ))}
                  <CompareRow what="Банк задач" free="Целиком" paid="Целиком" />
                </tbody>
              </table>
            </div>
          </section>

          <div className={styles.notes}>
            {year && month ? (
              <span>{`Зачёркнута стоимость двенадцати месяцев по ${billingFormat.rub(month.priceKopecks)}.`}</span>
            ) : null}
            <span>Повторная покупка продлевает доступ с даты окончания.</span>
            <ActionLink
              presentation="inline"
              icon="none"
              hierarchy="text"
              to="/vozvrat"
            >
              Условия возврата
            </ActionLink>
          </div>
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};

const PlanList: React.FC<{ items: readonly string[] }> = (props) => (
  <ul className={styles.list}>
    {props.items.map((item) => (
      <li key={item}>
        <Check aria-hidden="true" />
        {item}
      </li>
    ))}
  </ul>
);

const CompareRow: React.FC<{
  what: string;
  free: string;
  paid: string;
  freePartial?: boolean;
}> = (props) => (
  <tr>
    <th scope="row">{props.what}</th>
    <td data-partial={props.freePartial || undefined}>
      {props.freePartial ? (
        <Minus aria-hidden="true" />
      ) : (
        <Check aria-hidden="true" />
      )}
      {props.free}
    </td>
    <td data-paid>
      <Check aria-hidden="true" />
      {props.paid}
    </td>
  </tr>
);
