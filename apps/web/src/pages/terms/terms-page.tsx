import { Stack } from "@mantine/core";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import type { TermsPageTypes } from "./terms-page.types";

/** Terms for the free, anonymous educational service described by the current product. */
export const TermsPage: React.FC<TermsPageTypes.Props> = () => {
  return (
    <PageContainer>
      <Stack gap="md">
        <Typography.Title order={1}>
          Пользовательское соглашение
        </Typography.Title>
        <Typography.Text tone="muted">
          Редакция от 10 августа 2026 года
        </Typography.Text>
        <Typography.Prose>
          <p>
            infraege.ru — бесплатный образовательный сервис для самостоятельной
            подготовки к ЕГЭ по информатике. Использование сайта означает
            согласие с этими условиями.
          </p>
          <h2>Использование материалов</h2>
          <p>
            Материалы можно читать и использовать для личного обучения. Нельзя
            автоматически выгружать банк заданий, обходить технические
            ограничения, мешать работе сервиса или выдавать материалы сайта за
            собственные.
          </p>
          <h2>Проверка ответов</h2>
          <p>
            Разборы и автоматическая проверка предназначены для обучения и могут
            содержать ошибки. Они не заменяют официальные демоверсии,
            спецификации и критерии ФИПИ. О замеченной проблеме можно сообщить
            по ссылке в футере.
          </p>
          <h2>Доступность сервиса</h2>
          <p>
            Сервис предоставляется бесплатно «как есть». Функции и материалы
            могут обновляться, а доступ временно прерываться для обслуживания.
            Сайт не гарантирует конкретный экзаменационный результат.
          </p>
          <h2>Данные</h2>
          <p>
            Порядок обработки технических данных и аналитики описан в Политике
            обработки персональных данных.
          </p>
        </Typography.Prose>
      </Stack>
    </PageContainer>
  );
};
