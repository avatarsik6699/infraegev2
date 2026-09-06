import { ActionLink } from "~/shared/components/action-link";
import { ExternalLink } from "~/shared/components/external-link";
import { siteConfig } from "~/shared/config/site";
import { TelegramLogo } from "./telegram-logo";
import styles from "./public-footer.module.css";

export const PublicFooter: React.FC = () => (
  <footer className={styles.root}>
    <div className={styles.inner}>
      <nav className={styles.links} aria-label="Ссылки в подвале">
        <ActionLink hierarchy="drawn" to="/privacy">
          Обработка данных
        </ActionLink>
        <ExternalLink
          className={styles.telegramLink}
          href={siteConfig.telegramInviteUrl}
          hierarchy="drawn"
          newTab
        >
          <TelegramLogo />
          <span>Telegram-канал</span>
        </ExternalLink>
      </nav>
    </div>
  </footer>
);
