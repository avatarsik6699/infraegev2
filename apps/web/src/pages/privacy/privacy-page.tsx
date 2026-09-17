import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { siteConfig } from "~/shared/config/site";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import styles from "./privacy-page.module.css";
export const PrivacyPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader />
    <PageContainer component="main" measure="reading" className={styles.root}>
      <Typography.Title order={1}>
        Обработка персональных данных
      </Typography.Title>
      <Typography.Prose className={styles.content}>
        <Typography.Text>
          Актуально на 17 сентября 2026 года. На infraege.ru нет рекламных
          трекеров и необязательной аналитики.
        </Typography.Text>
        <Typography.Title order={2}>Работа сайта</Typography.Title>
        <Typography.Text>
          Ответ на задание передаётся серверу для проверки. Сервер не создаёт
          профиль ученика и не сохраняет историю ответов. Прогресс хранится в
          вашем браузере и не синхронизируется между устройствами.
        </Typography.Text>
        <Typography.Text>
          Для обслуживания и защиты сайта сервер ведёт технические журналы:
          время, путь запроса, метод, код ответа, IP-адрес, сведения о браузере
          и события защиты. Содержимое форм в журналы не записывается. Журналы
          хранятся до 30 дней; общий объём ограничен 1 ГБ.
        </Typography.Text>
        <Typography.Title order={2}>Хранение и доступ</Typography.Title>
        <Typography.Text>
          Приложение и база данных размещены на управляемом нами сервере в
          России. Доступ ограничен обслуживанием сайта. Данные не продаются и не
          используются для рекламы.
        </Typography.Text>
        <Typography.Title order={2}>Ваши данные</Typography.Title>
        <Typography.Text>
          Прогресс можно сбросить в уроке или удалить очисткой данных сайта в
          браузере. По вопросам обработки данных:{" "}
          <ExternalLink href={`mailto:${siteConfig.privacyContactEmail}`}>
            {siteConfig.privacyContactEmail}
          </ExternalLink>
          .
        </Typography.Text>
      </Typography.Prose>
    </PageContainer>
    <PublicFooter />
  </div>
);
