import { ActionLink } from "~/shared/components/action-link";
import { ExternalLink } from "~/shared/components/external-link";
import { Typography } from "~/shared/components/typography";
import { siteConfig } from "~/shared/config/site";
import { useSiteFlags } from "~/shared/lib/site-flags";
import { TelegramLogo } from "./telegram-logo";
import styles from "./public-footer.module.css";

export const PublicFooter: React.FC = () => {
  const { billing } = useSiteFlags();
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <span className={styles.signature} data-footer-signature>
          <span className={styles.mark} aria-hidden="true" />
          Кодумка
        </span>
        <nav className={styles.links} aria-label="Ссылки в подвале">
          <ActionLink hierarchy="text" to="/privacy">
            Обработка данных
          </ActionLink>
          {billing ? (
            <>
              <ActionLink hierarchy="text" to="/pricing">
                Тарифы
              </ActionLink>
              <ActionLink hierarchy="text" to="/oferta">
                Оферта
              </ActionLink>
              <ActionLink hierarchy="text" to="/vozvrat">
                Возврат
              </ActionLink>
            </>
          ) : null}
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
        {billing ? (
          <Typography.Text
            variant="caption"
            tone="muted"
            className={styles.seller}
            data-footer-seller
          >
            Самозанятый {siteConfig.seller.name}, ИНН {siteConfig.seller.inn}
            {" · "}
            <ExternalLink href={`mailto:${siteConfig.privacyContactEmail}`}>
              {siteConfig.privacyContactEmail}
            </ExternalLink>
          </Typography.Text>
        ) : null}
      </div>
    </footer>
  );
};
