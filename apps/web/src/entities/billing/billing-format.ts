import type { BillingTypes } from "./billing.types";

const rubles = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const dates = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Moscow",
});
const shortDates = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/Moscow",
});

export const billingFormat = {
  /** «2 990 ₽» with a non-breaking space; kopecks are whole rubles here. */
  rub(kopecks: number): string {
    return `${rubles.format(Math.round(kopecks / 100))}\u00a0₽`;
  },
  /** «17 октября 2027», Moscow time as the offer states. */
  date(iso: string): string {
    // «17 ноября 2026», without the trailing «г.» that would meet a sentence's full stop
    return dates.format(new Date(iso)).replace(/\s*г\.$/u, "");
  },
  /** «17.10.2027» for tables. */
  shortDate(iso: string): string {
    return shortDates.format(new Date(iso));
  },
  /** The year saving against twelve months, rounded down: «49». */
  savingPercent(plan: BillingTypes.Plan): number {
    return Math.floor((1 - plan.priceKopecks / plan.monthsPriceKopecks) * 100);
  },
};

export const billingPlans = {
  find(
    offer: BillingTypes.Offer | undefined,
    id: BillingTypes.PlanId,
  ): BillingTypes.Plan | undefined {
    return offer?.plans.find((plan) => plan.id === id);
  },
};
