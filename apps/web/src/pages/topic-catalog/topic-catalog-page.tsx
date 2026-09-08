import { useRef } from "react";
import { topicCatalog } from "~/entities/topic-catalog";
import { ExternalLink } from "~/shared/components/external-link";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { useElementActivity } from "~/shared/lib/element-activity";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { TopicCatalogAmbientField } from "./components/topic-catalog-ambient-field";
import { TopicCatalogCard } from "./components/topic-catalog-card";
import styles from "./topic-catalog-page.module.css";

const fipiDocumentsUrl =
  "https://fipi.ru/ege/demoversii-specifikacii-kodifikatory";

export const TopicCatalogPage: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const motionActive = useElementActivity(rootRef);

  return (
    <div className={styles.page} data-topic-catalog-page>
      <PublicHeader activeSection="topics" />
      <main
        ref={rootRef}
        className={styles.root}
        data-motion-active={motionActive || undefined}
      >
        <TopicCatalogAmbientField />
        <PageContainer
          className={styles.catalogSection}
          component="section"
          aria-labelledby="exam-map-heading"
        >
          <header className={styles.catalogHeading}>
            <div className={styles.catalogIdentity}>
              <Typography.Title id="exam-map-heading" order={1}>
                Темы ЕГЭ по информатике
              </Typography.Title>
              <div className={styles.catalogTools} data-catalog-toolbar>
                <Typography.Text tone="muted">
                  {`${String(topicCatalog.entries.length)} тем для всех 27 заданий`}
                </Typography.Text>
                <span className={styles.catalogSource}>
                  <span className={styles.catalogSeparator} aria-hidden="true">
                    ·
                  </span>
                  <ExternalLink
                    href={fipiDocumentsUrl}
                    hierarchy="drawn"
                    newTab
                  >
                    Структура экзамена — ФИПИ
                  </ExternalLink>
                </span>
              </div>
            </div>
          </header>

          <div className={styles.catalogMap}>
            <ol
              className={styles.topicList}
              data-topic-list
              aria-labelledby="exam-map-heading"
            >
              {topicCatalog.entries.map((entry) => (
                <TopicCatalogCard entry={entry} key={entry.id} />
              ))}
            </ol>
          </div>

          <aside
            className={styles.sourceNote}
            aria-label="Примечание о структуре экзамена"
          >
            <Typography.Text tone="muted">
              Задания 19–21 собраны в одну тему: в них используется общая
              игровая модель. Названия будущих тем сверены с проектом
              спецификации ЕГЭ 2027 и будут перепроверены после выхода финальной
              редакции.
            </Typography.Text>
          </aside>
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
