import { courseCatalog } from "~/entities/course";
import { useAccountSession } from "~/features/account";
import { PageContainer } from "~/shared/components/page-container";
import { PageHead } from "~/shared/components/page-head";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CourseCatalogCard } from "./components/course-catalog-card";
import type { CourseCatalogPageTypes } from "./course-catalog-page.types";
import { courseCatalogModel } from "./model/course-catalog-model";
import { useCourseCatalog } from "./model/use-course-catalog";
import styles from "./course-catalog-page.module.css";

/** F49: the home topics grid — one large card over two rows, two compact,
 * one wide underneath. */
const courseLayouts = ["feature", "compact", "compact", "wide"] as const;

export const CourseCatalogPage: React.FC<CourseCatalogPageTypes.Props> = (
  props,
) => {
  const catalog = useCourseCatalog(props.summaries);
  const session = useAccountSession();
  const isGuest = session.status === "ready" && !session.account;
  let summaryProgress = courseCatalogModel.progressText(catalog.summary);
  if (!session.account) {
    if (isGuest)
      summaryProgress = `Освоено 0 ${courseCatalogModel.ofLessons(catalog.total)}`;
    else if (session.status === "loading") summaryProgress = "Проверяем вход";
    else summaryProgress = "Не удалось проверить вход";
  }
  return (
    <div className={styles.page} data-course-catalog-page>
      <PublicHeader activeSection="courses" />
      <main id="main-content" className={styles.root}>
        <PageHead
          title="Мини-курсы"
          titleId="course-catalog-heading"
          lead="Навыки, которые остаются после экзамена."
          meta={
            <div className={styles.summary} data-course-summary>
              <span>
                Всего направлений: {courseCatalog.entries.length} · Доступно:{" "}
                {courseCatalog.availableCount} · Уроков: {catalog.total}
              </span>
              <span className={styles.summaryProgress} role="status">
                {summaryProgress}
              </span>
            </div>
          }
        />
        <PageContainer
          className={styles.catalogSection}
          component="section"
          aria-labelledby="course-catalog-heading"
        >
          <ol
            className={styles.courseList}
            data-course-list
            aria-labelledby="course-catalog-heading"
          >
            {courseCatalog.entries.map((entry, index) => (
              <CourseCatalogCard
                progress={catalog.byId[entry.id]}
                entry={entry}
                layout={courseLayouts[index] ?? "compact"}
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
