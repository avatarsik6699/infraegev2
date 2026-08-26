import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";
import { analyticsBrowser } from "~/shared/lib/analytics";
import { useExternalStoreValue } from "~/shared/lib/use-external-store-value";

export type AnalyticsConsentValue = "granted" | "denied";

const definition: SafeLsKey<AnalyticsConsentValue> = {
  key: "infraege.analytics-consent",
  version: 1,
  guard: (value): value is AnalyticsConsentValue =>
    value === "granted" || value === "denied",
};

export const analyticsConsentStore = safeLs.createStore(definition);

const grant = (): void => analyticsConsentStore.set("granted");
const deny = (): void => analyticsConsentStore.set("denied");
const withdraw = (): void => {
  analyticsConsentStore.set("denied");
  analyticsBrowser.withdraw();
};

export const analyticsConsentActions = { grant, deny, withdraw } as const;

export function useAnalyticsConsent(): AnalyticsConsentValue | null {
  return useExternalStoreValue(analyticsConsentStore);
}
