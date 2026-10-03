import { ActionLink } from "~/shared/components/action-link";
import { ExternalLink } from "~/shared/components/external-link";
import { siteConfig } from "~/shared/config/site";
import { TelegramLogo } from "./telegram-logo";
import styles from "./public-footer.module.css";

export const PublicFooter: React.FC = () => (
  <footer className={styles.root}>
    <div className={styles.inner}>
      <span className={styles.signature} data-footer-signature>
        <span className={styles.mark} aria-hidden="true" />
        infraege
      </span>
      <nav className={styles.links} aria-label="Ссылки в подвале">
        <ActionLink hierarchy="text" to="/privacy">
          Обработка данных
        </ActionLink>
        <ExternalLink
          className={styles.telegramLink}
          href={siteConfig.telegramInviteUrl}
          presentation="action"
          newTab
        >
          <TelegramLogo />
          <span>Telegram-канал</span>
        </ExternalLink>
      </nav>
    </div>
  </footer>
);
