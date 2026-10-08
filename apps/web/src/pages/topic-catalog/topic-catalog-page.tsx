import { Button } from "~/shared/components/button";
import { SearchField } from "~/shared/components/search-field";
import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { MascotScene } from "~/shared/components/mascot-scene";
import { PageHead } from "~/shared/components/page-head";
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
      <main id="main-content">
        <PageHead
          title="Темы ЕГЭ"
          titleId="exam-map-heading"
          lead="Теория, разобранные примеры и задачи с проверкой по каждому заданию экзамена."
          meta={
            <>
              <div className={styles.summary} data-topic-summary>
                <span>
                  Всего тем: {catalog.totalTopics} · Доступно:{" "}
                  {catalog.publishedTopics} ·
                </span>
                <span className={styles.summaryStatus}>
                  <span className={styles.summaryReserve} aria-hidden="true">
                    {topicCatalogModel.summaryText(null, true)}
                  </span>
                  <span className={styles.summaryText} role="status">
                    {topicCatalogModel.summaryText(
                      catalog.totalSolved,
                      catalog.unavailable,
                    )}
                  </span>
                </span>
                <Button
                  className={styles.retry}
                  data-visible={catalog.unavailable}
                  aria-hidden={!catalog.unavailable}
                  tabIndex={catalog.unavailable ? 0 : -1}
                  hierarchy="quiet"
                  density="compact"
                  onClick={catalog.retry}
                >
                  Повторить
                </Button>
              </div>
              <span data-topic-source-note>
                25 тем для всех 27 заданий: задания 19–21 собраны в одну тему ·{" "}
                <ExternalLink
                  href="https://fipi.ru/ege/demoversii-specifikacii-kodifikatory"
                  newTab
                >
                  Структура экзамена — ФИПИ
                </ExternalLink>
              </span>
            </>
          }
        />
        <PageContainer
          className={styles.catalogSection}
          component="section"
          aria-labelledby="exam-map-heading"
        >
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
                  hierarchy="quiet"
                  aria-pressed={catalog.filter === filter.value}
                  disabled={filter.value !== "all" && !catalog.ready}
                  onClick={() => catalog.setFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </form>
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
              <MascotScene
                scene="empty-search"
                className={styles.emptyIllustration}
              />
              <Typography.Title order={2} className={styles.emptyTitle}>
                Темы не найдены
              </Typography.Title>
              <Typography.Text tone="muted">
                Попробуйте другой запрос или сбросьте фильтры.
              </Typography.Text>
              <Button hierarchy="secondary" onClick={catalog.reset}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
