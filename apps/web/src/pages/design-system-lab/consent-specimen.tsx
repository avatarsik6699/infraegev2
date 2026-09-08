import { useState } from "react";
import { AnalyticsConsentNotice } from "~/features/analytics";
import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

export const ConsentSpecimen: React.FC = () => {
  const [result, setResult] = useState("Пример не меняет настройки аналитики.");
  return (
    <div data-component-specimen="AnalyticsConsentNotice">
      <div className={styles.consentSpecimen}>
        <AnalyticsConsentNotice
          onDeny={() => setResult("Пример: аналитика отклонена.")}
          onGrant={() => setResult("Пример: аналитика разрешена.")}
        />
      </div>
      <Typography.Text
        className={styles.specimenResult}
        variant="interface"
        tone="muted"
        aria-live="polite"
      >
        {result}
      </Typography.Text>
    </div>
  );
};
