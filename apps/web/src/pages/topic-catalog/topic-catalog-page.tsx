import { Button } from "~/shared/components/button";
import { InlineSelect } from "~/shared/components/inline-select";
import { EmptyState } from "~/shared/components/empty-state";
import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { MascotScene } from "~/shared/components/mascot-scene";
import { PageHead } from "~/shared/components/page-head";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { topicCatalog } from "~/entities/topic-catalog";
import { TopicCatalogCard } from "./components/topic-catalog-card";
import { TopicCatalogGoal } from "./components/topic-catalog-goal";
import { TopicCatalogMap } from "./components/topic-catalog-map";
import { topicCatalogModel } from "./model/topic-catalog-model";
import { useTopicCatalog } from "./model/use-topic-catalog";
import { useTopicGoal } from "./model/use-topic-goal";
import styles from "./topic-catalog-page.module.css";

const examOrder = topicCatalogModel.order(topicCatalog.entries);

export const TopicCatalogPage: React.FC = () => {
  const catalog = useTopicCatalog();
  const { goal, setGoal } = useTopicGoal();
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
                  <span role="status">
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
                Задания 19–21 — одна тема ·{" "}
                <ExternalLink
                  href="https://fipi.ru/ege/demoversii-specifikacii-kodifikatory"
                  newTab
                >
                  Структура экзамена — ФИПИ
                </ExternalLink>
              </span>
            </>
          }
          aside={<TopicCatalogMap entries={examOrder} goal={goal} />}
          asideOnNarrow
        />
        <PageContainer
          className={styles.catalogSection}
          component="section"
          aria-labelledby="exam-map-heading"
        >
          <form
            className={styles.toolbar}
            aria-label="Цель и прогресс"
            onSubmit={(event) => event.preventDefault()}
            data-catalog-toolbar
          >
            <TopicCatalogGoal goal={goal} onGoalChange={setGoal} />
            {/* F40: progress as a quiet dropdown on the right; the goal
                scale stays the line's one strong control. */}
            <div className={styles.progressFilter}>
              <InlineSelect
                label="Прогресс"
                value={catalog.filter}
                onValueChange={(value) =>
                  catalog.setFilter(
                    topicCatalogModel.filters.find(
                      (filter) => filter.value === value,
                    )?.value ?? "all",
                  )
                }
                options={topicCatalogModel.filters.map((filter) => ({
                  value: filter.value,
                  label: filter.label,
                  disabled: filter.value !== "all" && !catalog.ready,
                }))}
              />
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
                goal={goal}
              />
            ))}
          </ol>
          {catalog.entries.length === 0 && (
            // F45: the scene leads at full size, then one message and one way back.
            <div className={styles.empty} role="status">
              <MascotScene
                scene="empty-search"
                className={styles.emptyIllustration}
              />
              <EmptyState
                title={topicCatalogModel.emptyText(catalog.filter).title}
                description={topicCatalogModel.emptyText(catalog.filter).text}
                action={
                  <Button hierarchy="primary" onClick={catalog.reset}>
                    Показать все темы
                  </Button>
                }
              />
            </div>
          )}
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
