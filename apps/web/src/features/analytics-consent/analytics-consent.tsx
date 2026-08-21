import { useEffect, useState, useSyncExternalStore } from "react";
import { Typography } from "~/shared/components/typography";
import {
  analyticsBrowser,
  analyticsConsentStore,
  type AnalyticsConsentValue,
} from "~/shared/lib/analytics";
import { enhancementState } from "~/shared/lib/enhancement-state";
import styles from "./analytics-consent.module.css";

export const AnalyticsConsent: React.FC = () => {
  const consent = useSyncExternalStore(
    analyticsConsentStore.subscribe,
    analyticsConsentStore.get,
    analyticsConsentStore.getServerSnapshot,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const enhanced = useSyncExternalStore(
    enhancementState.subscribe,
    enhancementState.getClientSnapshot,
    enhancementState.getServerSnapshot,
  );
  useEffect(
    function loadConsentFx() {
      if (consent === "granted") analyticsBrowser.enable();
    },
    [consent],
  );
  function choose(value: AnalyticsConsentValue) {
    analyticsConsentStore.set(value);
    setSettingsOpen(false);
  }
  function withdraw() {
    analyticsConsentStore.set("denied");
    analyticsBrowser.withdraw();
  }
  if (consent !== null && !settingsOpen)
    return (
      <button
        type="button"
        className={`${styles.control} ${styles.settings}`}
        data-secondary
        data-analytics-consent-enhanced={enhanced}
        onClick={() => setSettingsOpen(true)}
      >
        Настройки аналитики
      </button>
    );
  return (
    <aside
      className={styles.panel}
      aria-label="Настройки необязательной аналитики"
      data-analytics-consent-enhanced={enhanced}
    >
      <Typography.Title order={2}>Помочь улучшить infraege?</Typography.Title>
      <Typography.Text>
        Разрешите обезличенную веб-аналитику и события прохождения уроков.
        Ответы, свободный текст и fingerprint не отправляются. Отказ не
        ограничивает сайт.
      </Typography.Text>
      <div className={styles.actions}>
        {consent === "granted" ? (
          <button
            type="button"
            className={styles.control}
            data-secondary
            onClick={withdraw}
          >
            Отозвать согласие
          </button>
        ) : null}
        <button
          type="button"
          className={styles.control}
          data-secondary
          onClick={() => choose("denied")}
        >
          Не разрешать
        </button>
        <button
          type="button"
          className={styles.control}
          onClick={() => choose("granted")}
        >
          Разрешить
        </button>
      </div>
    </aside>
  );
};
