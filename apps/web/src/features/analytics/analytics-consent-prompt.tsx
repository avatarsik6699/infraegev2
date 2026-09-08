import { AnalyticsConsentNotice } from "./analytics-consent-notice";
import { useEffect } from "react";
import { analyticsBrowser } from "~/shared/lib/analytics";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import {
  analyticsConsentActions,
  useAnalyticsConsent,
} from "./model/analytics-consent";
import styles from "./analytics.module.css";

export const AnalyticsConsentPrompt: React.FC = () => {
  const consent = useAnalyticsConsent();
  const enhanced = useIsEnhanced();

  useEffect(
    function enableConsentedAnalyticsFx() {
      if (consent === "granted") analyticsBrowser.enable();
    },
    [consent],
  );

  if (!enhanced || consent !== null) return null;

  return (
    <aside
      className={styles.banner}
      aria-label="Настройки необязательной аналитики"
      data-analytics-consent-enhanced={enhanced}
    >
      <AnalyticsConsentNotice
        onDeny={analyticsConsentActions.deny}
        onGrant={analyticsConsentActions.grant}
      />
    </aside>
  );
};
