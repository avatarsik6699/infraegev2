import { courseCatalog } from "~/entities/course";
import { useAccountSession } from "~/features/account";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseCatalogCard } from "./components/course-catalog-card";
import type { CourseCatalogPageTypes } from "./course-catalog-page.types";
import { courseCatalogModel } from "./model/course-catalog-model";
import { useCourseCatalog } from "./model/use-course-catalog";
import styles from "./course-catalog-page.module.css";

export const CourseCatalogPage: React.FC<CourseCatalogPageTypes.Props> = (
  props,
) => {
  const catalog = useCourseCatalog(props.summaries);
  const session = useAccountSession();
  const isGuest = session.status === "ready" && !session.account;
  let summaryProgress = courseCatalogModel.progressText(catalog.summary);
  if (!session.account) {
    if (isGuest)
      summaryProgress = `Освоено 0 из ${String(catalog.total)} уроков`;
    else if (session.status === "loading") summaryProgress = "Проверяем вход";
    else summaryProgress = "Не удалось проверить вход";
  }
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
            <Typography.Title
              id="course-catalog-heading"
              order={1}
              className={styles.heading}
            >
              Мини-курсы
            </Typography.Title>
            <Typography.Text className={styles.catalogLead}>
              Навыки, которые остаются после экзамена.
            </Typography.Text>
            <div className={styles.summary} data-course-summary>
              <span>
                Всего направлений: {courseCatalog.entries.length} · Доступно:{" "}
                {courseCatalog.availableCount} · Уроков: {catalog.total}
              </span>
              <span className={styles.summaryProgress} role="status">
                {summaryProgress}
              </span>
            </div>
          </header>
          <ol
            className={styles.courseList}
            data-course-list
            aria-labelledby="course-catalog-heading"
          >
            {courseCatalog.entries.map((entry) => (
              <CourseCatalogCard
                progress={catalog.byId[entry.id]}
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
