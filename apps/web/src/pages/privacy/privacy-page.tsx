import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import styles from "./privacy-page.module.css";

export const PrivacyPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader />
    <main className={styles.root}>
      <Typography.Title order={1}>Обработка данных</Typography.Title>
      <Typography.Text className={styles.updated} tone="muted">
        Актуально на 19 августа 2026 года
      </Typography.Text>

      <Typography.Prose className={styles.content}>
        <Typography.Text>
          Сайт infraege помогает готовиться к ЕГЭ по информатике. Мы собираем
          только данные, необходимые для работы сайта, понимания общей
          посещаемости и исправления технических ошибок.
        </Typography.Text>

        <Typography.Title order={2}>
          Какие данные обрабатываются
        </Typography.Title>
        <ul>
          <li>
            обезличенные сведения о просмотре страниц, если на сайте включена
            система веб-аналитики Umami;
          </li>
          <li>
            технические сведения об ошибках интерфейса без содержимого ответов
            на задания и других пользовательских данных;
          </li>
          <li>
            стандартные журналы веб-сервера: время запроса, запрошенный адрес,
            код ответа, IP-адрес и технические характеристики клиента;
          </li>
          <li>
            прогресс чтения и практики, включая идентификаторы решённых заданий
            и отправленные правильные ответы; эти сведения хранятся только в
            вашем браузере и не отправляются на сервер для хранения.
          </li>
        </ul>

        <Typography.Title order={2}>Зачем это нужно</Typography.Title>
        <Typography.Text>
          Данные используются для доставки страниц, защиты и стабильной работы
          сервиса, подсчёта общей посещаемости и диагностики ошибок. Мы не
          используем их для рекламного профилирования и не продаём третьим
          лицам.
        </Typography.Text>

        <Typography.Title order={2}>Хранение в браузере</Typography.Title>
        <Typography.Text>
          Ответ отправляется серверу для проверки, но не сохраняется там. После
          правильной проверки введённое значение остаётся частью локального
          прогресса в браузере. Локальный прогресс можно удалить, очистив данные
          сайта в настройках браузера. После очистки восстановить его на сервере
          нельзя: аккаунта и серверной синхронизации прогресса сейчас нет.
        </Typography.Text>

        <Typography.Title order={2}>Сведения об операторе</Typography.Title>
        <Typography.Text>
          ФИО или наименование оператора, реквизиты, адрес и публичный адрес
          электронной почты будут добавлены позднее. До их публикации на этой
          странице нет канала для направления обращений оператору.
        </Typography.Text>
      </Typography.Prose>
    </main>
    <PublicFooter />
  </div>
);
