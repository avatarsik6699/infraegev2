import { courseCatalog } from "~/entities/course";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseCatalogAmbientField } from "./components/course-catalog-ambient-field";
import { CourseCatalogCard } from "./components/course-catalog-card";
import { CourseCatalogStaircase } from "./components/course-catalog-staircase";
import { CourseCatalogTrail } from "./components/course-catalog-trail";
import styles from "./course-catalog-page.module.css";

export const CourseCatalogPage: React.FC = () => {
  return (
    <div className={styles.page} data-course-catalog-page>
      <PublicHeader activeSection="courses" />
      <main className={styles.root}>
        <CourseCatalogAmbientField />
        <CourseCatalogStaircase continuation />
        <PageContainer
          className={styles.catalogSection}
          component="section"
          aria-labelledby="course-catalog-heading"
        >
          <CourseCatalogTrail />
          <header className={styles.catalogHeading}>
            <div className={styles.headingCopy}>
              <Typography.Title id="course-catalog-heading" order={1}>
                Мини-курсы
              </Typography.Title>
              <Typography.Text className={styles.catalogLead}>
                Самостоятельные программы, чтобы последовательно освоить
                отдельный навык и закрепить его на практике.
              </Typography.Text>
              <div className={styles.headingDetails}>
                <Typography.Text className={styles.catalogMeta} tone="muted">
                  {`${String(courseCatalog.availableCount)} курс доступен · ${String(courseCatalog.plannedCount)} в плане`}
                </Typography.Text>
              </div>
            </div>
            <CourseCatalogStaircase />
          </header>

          <ol
            className={styles.courseList}
            data-course-list
            aria-labelledby="course-catalog-heading"
          >
            {courseCatalog.entries.map((entry) => (
              <CourseCatalogCard entry={entry} key={entry.id} />
            ))}
          </ol>
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
