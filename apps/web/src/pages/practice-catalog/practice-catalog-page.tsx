import { practiceCatalog } from "~/entities/practice-task";
import { PublicHeader } from "~/widgets/public-header";
import { PublicFooter } from "~/widgets/public-footer";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import type { PracticeCatalogPageTypes } from "./practice-catalog-page.types";
import { PracticeFilters } from "./components/practice-filters";
import { PracticeResults } from "./components/practice-results";
import styles from "./practice-catalog-page.module.css";

export const PracticeCatalogPage: React.FC<PracticeCatalogPageTypes.Props> = (
  props,
) => (
  <div className={styles.page}>
    <PublicHeader activeSection="practice" />
    <PageContainer component="main" className={styles.main}>
      <header className={styles.heading}>
        <Typography.Title order={1} variant="catalog">
          Практика
        </Typography.Title>
        <Typography.Text tone="muted">
          Выберите задачу и решайте в своём темпе. Подсказки и разбор доступны
          сразу.
        </Typography.Text>
      </header>
      <PracticeFilters
        key={practiceCatalog.href(props.search)}
        search={props.search}
        facets={props.result.facets}
      />
      <PracticeResults {...props} />
    </PageContainer>
    <PublicFooter />
  </div>
);
