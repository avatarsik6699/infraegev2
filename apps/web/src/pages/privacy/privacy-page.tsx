import { Stack } from "@mantine/core";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import type { PrivacyPageTypes } from "./privacy-page.types";

/** Factual description of the current anonymous product and operational telemetry. */
export const PrivacyPage: React.FC<PrivacyPageTypes.Props> = () => {
  return (
    <PageContainer>
      <Stack gap="md">
        <Typography.Title order={1}>
          Политика обработки персональных данных
        </Typography.Title>
        <Typography.Text tone="muted">
          Редакция от 10 августа 2026 года
        </Typography.Text>
        <Typography.Prose>
          <p>
            Эта страница описывает, какие данные обрабатывает образовательный
            сайт infraege.ru. На сайте нет аккаунтов, регистрации, платёжных
            форм и формы обратной связи.
          </p>
          <h2>Какие данные используются</h2>
          <ul>
            <li>
              технические журналы запросов: адрес страницы, время, HTTP-статус,
              технический IP-адрес и user-agent;
            </li>
            <li>
              обезличенная аналитика Umami: просмотр темы, начало практики,
              номер выполненного задания и результат проверки;
            </li>
            <li>
              прогресс обучения, который хранится только в localStorage браузера
              и не передаётся на сервер.
            </li>
          </ul>
          <p>
            Текст введённого ответа, содержимое localStorage, query/hash URL,
            имя, телефон и email в аналитику не отправляются. Umami работает без
            cookies, а подключённый скрипт учитывает настройку Do Not Track.
          </p>
          <h2>Цели и сроки</h2>
          <p>
            Журналы нужны для безопасности, диагностики ошибок и защиты от
            автоматизированных запросов и хранятся до 30 дней. Агрегированная
            аналитика хранится до 13 месяцев, метрики сервера — до 30 дней.
          </p>
          <h2>Хранение и обращения</h2>
          <p>
            Основная обработка выполняется на сервере в России. Данные не
            продаются и не используются для рекламного профилирования. Вопрос
            или запрос об удалении можно отправить через ссылку «Сообщить о
            проблеме» внизу сайта. Формальные реквизиты оператора и специальный
            канал обращений будут опубликованы отдельным обновлением этой
            политики.
          </p>
        </Typography.Prose>
      </Stack>
    </PageContainer>
  );
};
