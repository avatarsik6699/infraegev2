import { ActionLink } from "~/shared/components/action-link";
import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { siteConfig } from "~/shared/config/site";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { operator } from "./model/operator";
import styles from "./privacy-page.module.css";

const contact = (
  <ExternalLink href={`mailto:${siteConfig.privacyContactEmail}`}>
    {siteConfig.privacyContactEmail}
  </ExternalLink>
);

/** A separate document since 1 September 2025 (152-ФЗ ст. 9 ч. 1); its
 * version is the one the forms send (`CONSENT_VERSION`). */
export const ConsentPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader />
    <PageContainer component="main" measure="reading" className={styles.root}>
      <Typography.Title order={1}>
        Согласие на обработку персональных данных
      </Typography.Title>
      <Typography.Prose className={styles.content}>
        <Typography.Text>Версия от 25 октября 2026 года.</Typography.Text>
        <Typography.Text>
          Отмечая согласие в форме регистрации — по почте или после входа через
          VK ID или Яндекс ID, — я свободно, своей волей и в своём интересе
          разрешаю оператору {operator.nameDative} ({operator.status}, ИНН{" "}
          {operator.inn}, адрес для обращений: {contact}) обрабатывать мои
          персональные данные на условиях ниже. Согласие не включает рекламные
          рассылки. Мне исполнилось 14 лет; если нет, согласие от моего имени
          даёт мой родитель или иной законный представитель.
        </Typography.Text>
        <Typography.Title order={2}>Цели</Typography.Title>
        <Typography.Text>
          Создание аккаунта на kodumka.ru, подтверждение почты, вход и защита
          аккаунта, сохранение учебных результатов и служебные письма о входе и
          безопасности аккаунта.
        </Typography.Text>
        <Typography.Title order={2}>Данные</Typography.Title>
        <Typography.Text>
          Адрес электронной почты и отметка о его подтверждении, хеш пароля,
          идентификатор VK ID или Яндекс ID, сведения о сеансах входа и
          устройствах (случайный идентификатор браузера, тип браузера и системы,
          IP-адрес и город, время входа и последней активности), идентификаторы
          и время верно решённых задач и контекст их решения — без текста
          ответов.
        </Typography.Text>
        <Typography.Title order={2}>Действия и способ</Typography.Title>
        <Typography.Text>
          Сбор, запись, систематизация, накопление, хранение, уточнение,
          использование, передача (предоставление) указанным ниже получателям,
          обезличивание, блокирование, удаление и уничтожение —
          автоматизированно, на сервере в России.
        </Typography.Text>
        <Typography.Title order={2}>Получатели</Typography.Title>
        <Typography.Text>
          Yandex Cloud Postbox — для доставки писем (адрес и содержание письма);
          хранилище резервных копий Yandex Object Storage (Россия) — в
          зашифрованном виде.
        </Typography.Text>
        <Typography.Title order={2}>Срок и отзыв</Typography.Title>
        <Typography.Text>
          Согласие действует до удаления аккаунта или до его отзыва. Отозвать
          согласие можно, удалив аккаунт в профиле или написав на {contact}.
          После отзыва обработка, основанная на согласии, прекращается, а данные
          удаляются в течение 30 дней, если их хранение не требуется по другому
          законному основанию; в резервных копиях они остаются до ротации копий.
          Без обработки данных аккаунт работать не может; уроки и проверка
          ответов доступны без аккаунта. Подробнее — в{" "}
          <ActionLink presentation="inline" icon="none" to="/privacy">
            политике обработки персональных данных
          </ActionLink>
          .
        </Typography.Text>
        <Typography.Title order={2}>Если вам нет 18 лет</Typography.Title>
        <Typography.Text>
          Обсудите регистрацию с родителем или другим законным представителем.
          Сайт не проверяет возраст; родитель может обратиться к оператору,
          чтобы получить сведения о данных или удалить аккаунт.
        </Typography.Text>
      </Typography.Prose>
    </PageContainer>
    <PublicFooter />
  </div>
);
