import { Link } from "@tanstack/react-router";
import { ExternalLink } from "~/shared/components/external-link";
import { siteConfig } from "~/shared/config/site";
import { TelegramLogo } from "./telegram-logo";
import styles from "./public-footer.module.css";

type Props = {
  seamless?: boolean;
};

export const PublicFooter: React.FC<Props> = ({ seamless = false }) => (
  <footer className={styles.root} data-seamless={seamless || undefined}>
    <span>infraege</span>
    <nav className={styles.links} aria-label="Ссылки в подвале">
      <Link to="/privacy">Обработка данных</Link>
      <ExternalLink
        className={styles.telegramLink}
        href={siteConfig.telegramInviteUrl}
        newTab
      >
        <TelegramLogo />
        <span>Telegram-канал</span>
      </ExternalLink>
    </nav>
  </footer>
);
