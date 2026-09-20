import { Button } from "~/shared/components/button";
import { SearchField } from "~/shared/components/search-field";
import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { TopicCatalogCard } from "./components/topic-catalog-card";
import { topicCatalogModel } from "./model/topic-catalog-model";
import { useTopicCatalog } from "./model/use-topic-catalog";
import styles from "./topic-catalog-page.module.css";

export const TopicCatalogPage: React.FC = () => {
  const catalog = useTopicCatalog();
  return (
    <div className={styles.page} data-topic-catalog-page>
      <PublicHeader activeSection="topics" />
      <main>
        <PageContainer
          className={styles.catalogSection}
          component="section"
          aria-labelledby="exam-map-heading"
        >
          <header className={styles.catalogHeading}>
            <Typography.Title
              id="exam-map-heading"
              className={styles.heading}
              order={1}
            >
              Темы ЕГЭ
            </Typography.Title>
            <div className={styles.summary} data-topic-summary>
              <span className={styles.catalogMetadata}>
                Всего тем: {catalog.totalTopics} · Доступно:{" "}
                {catalog.publishedTopics}
              </span>
              <span className={styles.summaryText} role="status">
                {topicCatalogModel.summaryText(
                  catalog.totalSolved,
                  catalog.unavailable,
                )}
              </span>
              <Button
                className={styles.retry}
                data-visible={catalog.unavailable}
                aria-hidden={!catalog.unavailable}
                tabIndex={catalog.unavailable ? 0 : -1}
                hierarchy="quiet"
                onClick={catalog.retry}
              >
                Повторить
              </Button>
            </div>
          </header>
          <form
            className={styles.toolbar}
            aria-label="Поиск и фильтры тем"
            onSubmit={(event) => event.preventDefault()}
            data-catalog-toolbar
          >
            <SearchField
              label="Поиск тем"
              labelVisibility="sr-only"
              name="q"
              placeholder="Найти тему"
              value={catalog.query}
              onValueChange={catalog.setQuery}
              maxLength={200}
              submitLabel="Найти тему"
              clearLabel="Очистить поиск"
            />
            <div
              className={styles.filters}
              role="group"
              aria-label="Прогресс практики"
            >
              {topicCatalogModel.filters.map((filter) => (
                <Button
                  key={filter.value}
                  hierarchy={
                    catalog.filter === filter.value ? "primary" : "soft"
                  }
                  aria-pressed={catalog.filter === filter.value}
                  disabled={filter.value !== "all" && !catalog.ready}
                  onClick={() => catalog.setFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </form>
          <div className={styles.columnHeadings} aria-hidden="true">
            <span>Номер ЕГЭ</span>
            <span>Тема</span>
            <span>Теория и практика</span>
          </div>
          <ol
            className={styles.topicList}
            data-topic-list
            aria-labelledby="exam-map-heading"
          >
            {catalog.entries.map((entry) => (
              <TopicCatalogCard
                key={entry.id}
                entry={entry}
                progress={catalog.byId[entry.id]}
                loadState={catalog.loadState}
              />
            ))}
          </ol>
          {catalog.entries.length === 0 && (
            <div className={styles.empty} role="status">
              <Typography.Title order={2}>Темы не найдены</Typography.Title>
              <Typography.Text tone="muted">
                Попробуйте другой запрос или сбросьте фильтры.
              </Typography.Text>
              <Button hierarchy="secondary" onClick={catalog.reset}>
                Сбросить фильтры
              </Button>
            </div>
          )}
          <aside
            className={styles.sourceNote}
            aria-label="Примечание о структуре экзамена"
          >
            <Typography.Text tone="muted">
              25 тем для всех 27 заданий. Задания 19–21 собраны в одну тему: в
              них используется общая игровая модель. Названия будущих тем
              сверены с проектом спецификации ЕГЭ 2027 и будут перепроверены
              после выхода финальной редакции.
            </Typography.Text>
            <ExternalLink
              href="https://fipi.ru/ege/demoversii-specifikacii-kodifikatory"
              presentation="action"
              newTab
            >
              Структура экзамена — ФИПИ
            </ExternalLink>
          </aside>
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
