import { practiceCatalog } from "~/entities/practice-task";
import { PublicHeader } from "~/widgets/public-header";
import { PublicFooter } from "~/widgets/public-footer";
import { PageContainer } from "~/shared/components/page-container";
import { PageHead } from "~/shared/components/page-head";
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
      <main id="main-content" className={styles.mainFrame}>
        <PageHead title="Практика" lead="Решай задачи и закрепляй теорию" />
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
