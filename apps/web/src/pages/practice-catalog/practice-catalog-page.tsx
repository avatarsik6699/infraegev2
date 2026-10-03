import { practiceCatalog } from "~/entities/practice-task";
import { PublicHeader } from "~/widgets/public-header";
import { PublicFooter } from "~/widgets/public-footer";
import { PageContainer } from "~/shared/components/page-container";
import { PageHead } from "~/shared/components/page-head";
import { InfoPopover } from "~/shared/components/info-popover";
import { Typography } from "~/shared/components/typography";
import type { PracticeCatalogPageTypes } from "./practice-catalog-page.types";
import { PracticeFilters } from "./components/practice-filters";
import { PracticeResults } from "./components/practice-results";
import styles from "./practice-catalog-page.module.css";

export const PracticeCatalogPage: React.FC<PracticeCatalogPageTypes.Props> = (
  props,
) => {
  return (
    <div className={styles.page}>
      <PublicHeader activeSection="practice" />
      <main className={styles.mainFrame}>
        <PageHead>
          <header className={styles.heading}>
            <Typography.Title
              order={1}
              variant="catalog"
              className={styles.pageTitle}
            >
              Практика
            </Typography.Title>
            <div className={styles.subtitle}>
              <Typography.Text tone="muted">
                Решай задачи и закрепляй теорию
              </Typography.Text>
              <InfoPopover label="Как работает практика">
                <ul>
                  <li>
                    Черновики сохраняются при сворачивании. При смене поиска,
                    тем, сортировки или страницы, уходе и перезагрузке они
                    сбросятся.
                  </li>
                  <li>
                    В аккаунте решения сохраняются отдельно для каждого
                    контекста.
                  </li>
                </ul>
              </InfoPopover>
            </div>
          </header>
        </PageHead>
        <PageContainer component="div" className={styles.main}>
          <PracticeFilters
            key={practiceCatalog.href(props.search)}
            search={props.search}
            facets={props.result.facets}
          />
          <PracticeResults
            key={`results:${practiceCatalog.href(props.search)}`}
            {...props}
          />
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
