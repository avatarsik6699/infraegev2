import type { AnalyticsConsentNoticeTypes } from "./analytics-consent-notice.types";
import { Link } from "@tanstack/react-router";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import styles from "./analytics.module.css";

export const AnalyticsConsentNotice: React.FC<
  AnalyticsConsentNoticeTypes.Props
> = (props) => (
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
        стоит исправить. Ответы, введённый текст и контактные данные в аналитику
        не отправляются.
      </Typography.Text>
      <Link className={styles.privacyLink} to="/privacy">
        Подробнее об обработке данных
      </Link>
    </div>
    <div className={styles.actions}>
      <Button hierarchy="quiet" onClick={props.onDeny}>
        Не сейчас
      </Button>
      <Button onClick={props.onGrant}>Разрешить аналитику</Button>
    </div>
  </div>
);
