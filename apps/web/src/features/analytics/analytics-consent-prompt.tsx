import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
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
      <div className={styles.bannerInner}>
        <div className={styles.copy}>
          <Typography.Text className={styles.bannerTitle}>
            Помогите сделать уроки понятнее
            <span className={styles.promptEmoji} aria-hidden="true">
              👉👈
            </span>
          </Typography.Text>
          <Typography.Text variant="interface" tone="muted">
            Обезличенная статистика помогает понять, что в уроках удобно, а что
            стоит исправить. Ответы, введённый текст и контактные данные в
            аналитику не отправляются.
          </Typography.Text>
          <Link className={styles.privacyLink} to="/privacy">
            Подробнее об обработке данных
          </Link>
        </div>
        <div className={styles.actions}>
          <Button hierarchy="quiet" onClick={analyticsConsentActions.deny}>
            Не сейчас
          </Button>
          <Button onClick={analyticsConsentActions.grant}>
            Разрешить аналитику
          </Button>
        </div>
      </div>
    </aside>
  );
};
