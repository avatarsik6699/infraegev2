import { courseCatalog, type CourseProgressTypes } from "~/entities/course";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseCatalogCard } from "./components/course-catalog-card";
import styles from "./course-catalog-page.module.css";

type Props = {
  summaries: Record<string, readonly CourseProgressTypes.Lesson[] | null>;
};

export const CourseCatalogPage: React.FC<Props> = (props) => {
  return (
    <div className={styles.page} data-course-catalog-page>
      <PublicHeader activeSection="courses" />
      <main className={styles.root}>
        <PageContainer
          className={styles.catalogSection}
          component="section"
          aria-labelledby="course-catalog-heading"
        >
          <header className={styles.catalogHeading}>
            <div className={styles.headingCopy}>
              <Typography.Title id="course-catalog-heading" order={1}>
                Мини-курсы
              </Typography.Title>
              <Typography.Text className={styles.catalogLead}>
                Самостоятельные программы, чтобы последовательно освоить
                отдельный навык и закрепить его на практике.
              </Typography.Text>
              <div>
                <Typography.Text tone="muted">
                  {`${String(courseCatalog.availableCount)} курс доступен · ${String(courseCatalog.plannedCount)} в плане`}
                </Typography.Text>
              </div>
            </div>
          </header>

          <ol
            className={styles.courseList}
            data-course-list
            aria-labelledby="course-catalog-heading"
          >
            {courseCatalog.entries.map((entry) => (
              <CourseCatalogCard
                lessons={props.summaries[entry.id] ?? null}
                entry={entry}
                key={entry.id}
              />
            ))}
          </ol>
        </PageContainer>
      </main>
      <PublicFooter />
    </div>
  );
};
