import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { siteConfig } from "~/shared/config/site";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import styles from "./privacy-page.module.css";

export const ConsentPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader />
    <PageContainer component="main" measure="reading" className={styles.root}>
      <Typography.Title order={1}>
        Согласие на обработку персональных данных
      </Typography.Title>
      <Typography.Prose className={styles.content}>
        <Typography.Text>Версия от 25 сентября 2026 года.</Typography.Text>
        <Typography.Text>
          Создавая аккаунт и отдельно отмечая согласие в форме регистрации, вы
          разрешаете оператору сайта infraege.ru обрабатывать указанные ниже
          данные для создания аккаунта, подтверждения почты, входа и сохранения
          ваших учебных результатов. Оператор доступен по адресу{" "}
          <ExternalLink href={`mailto:${siteConfig.privacyContactEmail}`}>
            {siteConfig.privacyContactEmail}
          </ExternalLink>
          . Это согласие не включает рекламу и маркетинговые рассылки.
        </Typography.Text>
        <Typography.Title order={2}>Какие данные и действия</Typography.Title>
        <Typography.Text>
          При регистрации по почте это адрес, отметка о его подтверждении,
          стойкий хеш пароля, идентификаторы и сроки действия сеансов и
          одноразовых ссылок. При решении задач в аккаунте сохраняются
          идентификатор и версия верно решённой задачи, контекст урока или
          самостоятельной практики и время решения — не текст ответа. Мы
          получаем, записываем, систематизируем, храним, используем и удаляем
          эти данные автоматизированно на сервере в России.
        </Typography.Text>
        <Typography.Title order={2}>Передача и срок</Typography.Title>
        <Typography.Text>
          Для доставки служебного письма адрес и содержание письма передаются
          Yandex Cloud Postbox. Защищённые резервные копии сайта временно
          содержат те же данные. Данные аккаунта хранятся до удаления аккаунта;
          неподтверждённая регистрация без другого способа входа удаляется после
          30 дней при отсутствии действующей ссылки, а действующие сеансы — до
          30 дней. Удалённые данные могут оставаться в резервных копиях до
          окончания их срока хранения; подробности и другие сроки — в политике
          обработки данных.
        </Typography.Text>
        <Typography.Title order={2}>Отзыв</Typography.Title>
        <Typography.Text>
          Вы можете удалить аккаунт в его настройках или направить запрос об
          отзыве согласия на{" "}
          <ExternalLink href={`mailto:${siteConfig.privacyContactEmail}`}>
            {siteConfig.privacyContactEmail}
          </ExternalLink>
          . После отзыва мы прекратим обработку, основанную на согласии, и
          удалим данные в установленные сроки, если другое законное основание не
          требует их сохранения. Без обработки данных аккаунт и сохранение
          прогресса работать не смогут; читать уроки и проверять ответы можно
          без аккаунта.
        </Typography.Text>
        <Typography.Title order={2}>Если вам нет 18 лет</Typography.Title>
        <Typography.Text>
          Обсудите регистрацию с родителем или другим законным представителем.
          Сайт пока не проверяет возраст и полномочия представителя; отметка в
          форме сама по себе не подтверждает такие полномочия. Уроки и проверка
          ответов доступны без аккаунта.
        </Typography.Text>
      </Typography.Prose>
    </PageContainer>
    <PublicFooter />
  </div>
);
