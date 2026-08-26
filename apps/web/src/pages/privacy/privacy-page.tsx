import { AnalyticsConsentControl } from "~/features/analytics";
import { ExternalLink } from "~/shared/components/external-link";
import { Typography } from "~/shared/components/typography";
import { siteConfig } from "~/shared/config/site";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import styles from "./privacy-page.module.css";

export const PrivacyPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader />
    <main className={styles.root}>
      <Typography.Title order={1}>
        Обработка персональных данных
      </Typography.Title>
      <Typography.Text className={styles.updated} tone="muted">
        Актуально на 26 августа 2026 года
      </Typography.Text>
      <Typography.Prose className={styles.content}>
        <Typography.Text>
          Здесь простыми словами описано, какие данные использует infraege.ru и
          зачем. Необязательная аналитика не запускается без вашего разрешения.
          Само по себе использование сайта согласием не считается.
        </Typography.Text>

        <Typography.Title order={2}>
          Что нужно для работы сайта
        </Typography.Title>
        <ul>
          <li>
            технические журналы содержат время запроса, путь без содержимого
            формы, метод, код ответа, IP-адрес, сведения о браузере, request id
            и события защиты;
          </li>
          <li>
            сообщения о технических сбоях не включают ответ на задание или
            свободный пользовательский текст;
          </li>
          <li>
            введённый ответ передаётся API только для проверки: сервер не
            создаёт профиль ученика и не сохраняет историю ответов;
          </li>
          <li>
            прогресс, решённые задания и принятые ответы хранятся только в
            браузере и не синхронизируются с аккаунтом.
          </li>
        </ul>
        <Typography.Text>
          Эти данные нужны, чтобы открыть запрошенную страницу, проверить ответ,
          защитить сервис от злоупотреблений и разобраться в технических сбоях.
          Отказ от необязательной аналитики на эту работу не влияет.
        </Typography.Text>

        <Typography.Title order={2}>
          Аналитика — только с разрешения
        </Typography.Title>
        <Typography.Text>
          Если вы нажмёте «Разрешить аналитику», загрузится размещённый на нашем
          сервере Umami. Он получает просмотры и визиты, путь страницы без
          query-параметров и hash, источник перехода, приблизительные
          страну/регион/город, язык, тип устройства, ОС, браузер и длительность
          визита. Также отправляются события из закрытого списка: открытие урока
          или раздела, начало практики, результат проверки без самого ответа,
          завершение урока и переход к продолжению.
        </Typography.Text>
        <Typography.Text>
          Ответы, свободный текст, query/hash, рекламные идентификаторы и
          созданный нами цифровой отпечаток браузера не отправляются. Umami
          может объединять события в техническую псевдонимную сессию на
          основании данных запроса, но мы не используем её для установления
          личности. В отчётах автоматизированный трафик отделяется от браузерной
          аналитики, а неопределённый трафик не считается человеком.
        </Typography.Text>

        <Typography.Title order={2}>Хранение и доступ</Typography.Title>
        <ul>
          <li>
            локальный прогресс остаётся в браузере до очистки данных сайта;
          </li>
          <li>серверные журналы ограничены сроком 30 дней и объёмом 1 ГБ;</li>
          <li>
            исходные данные Umami хранятся не более 13 месяцев, техническая
            система мониторинга хранит полученные сигналы 30 дней, а почасовые
            агрегаты — 13 месяцев.
          </li>
        </ul>
        <Typography.Text>
          Приложение, Umami и их базы размещены на управляемом нами сервере в
          России. Доступ к данным есть только в объёме, необходимом для работы
          инфраструктуры и закрытого мониторинга. Данные не продаются, не
          используются для рекламы и не участвуют в автоматическом принятии
          решений о пользователе.
        </Typography.Text>

        <Typography.Title order={2}>Ваш выбор</Typography.Title>
        <Typography.Text>
          Плашка с предложением аналитики остаётся на экране, пока вы не
          выберете один из вариантов. Решение можно изменить ниже. Отключение
          останавливает будущую необязательную отправку, но не превращает уже
          обработанные агрегаты в индивидуальную историю.
        </Typography.Text>
        <AnalyticsConsentControl />
        <Typography.Text>
          Локальный прогресс можно удалить очисткой данных сайта в браузере. По
          вопросам обработки данных напишите на{" "}
          <ExternalLink href={`mailto:${siteConfig.privacyContactEmail}`}>
            {siteConfig.privacyContactEmail}
          </ExternalLink>
          . Новости проекта и обратная связь доступны в Telegram-канале:{" "}
          <ExternalLink href={siteConfig.telegramInviteUrl} newTab>
            ссылка-приглашение
          </ExternalLink>
          .
        </Typography.Text>
      </Typography.Prose>
    </main>
    <PublicFooter />
  </div>
);
