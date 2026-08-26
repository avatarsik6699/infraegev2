import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import {
  analyticsConsentActions,
  useAnalyticsConsent,
} from "./model/analytics-consent";
import styles from "./analytics.module.css";

export const AnalyticsConsentControl: React.FC = () => {
  const consent = useAnalyticsConsent();
  const enhanced = useIsEnhanced();

  if (!enhanced) return null;

  if (consent === "granted") {
    return (
      <div className={styles.consentControl} data-analytics-consent="granted">
        <Typography.Text tone="muted">
          Необязательная аналитика сейчас включена.
        </Typography.Text>
        <Button
          hierarchy="secondary"
          onClick={analyticsConsentActions.withdraw}
        >
          Отключить аналитику
        </Button>
      </div>
    );
  }

  if (consent === "denied") {
    return (
      <div className={styles.consentControl} data-analytics-consent="denied">
        <Typography.Text tone="muted">
          Необязательная аналитика сейчас выключена.
        </Typography.Text>
        <Button hierarchy="secondary" onClick={analyticsConsentActions.grant}>
          Разрешить аналитику
        </Button>
      </div>
    );
  }

  return (
    <Typography.Text tone="muted" data-analytics-consent="pending">
      Решение ещё не принято — выберите вариант в плашке внизу страницы.
    </Typography.Text>
  );
};
