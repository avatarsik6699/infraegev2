import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";

export type AnalyticsConsentValue = "granted" | "denied";
const definition: SafeLsKey<AnalyticsConsentValue> = {
  key: "infraege.analytics-consent",
  version: 1,
  guard: (value): value is AnalyticsConsentValue =>
    value === "granted" || value === "denied",
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const analyticsConsentStore = {
  get: () => safeLs.get(definition),
  getServerSnapshot: () => null,
  set: (value: AnalyticsConsentValue) => {
    safeLs.set(definition, value);
    emit();
  },
  remove: () => {
    safeLs.remove(definition);
    emit();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    const unsubscribeStorage = safeLs.subscribe(definition, listener);
    return () => {
      listeners.delete(listener);
      unsubscribeStorage();
    };
  },
};
