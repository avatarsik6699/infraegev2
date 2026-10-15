import { PracticePagination } from "./practice-pagination";
import { useRouter } from "@tanstack/react-router";
import { practiceCatalog } from "~/entities/practice-task";
import { Typography } from "~/shared/components/typography";
import { EmptyState } from "~/shared/components/empty-state";
import { MascotScene } from "~/shared/components/mascot-scene";
import { Button } from "~/shared/components/button";
import { ActionLink } from "~/shared/components/action-link";
import type { PracticeCatalogPageTypes } from "../practice-catalog-page.types";
import { PracticeTaskList } from "./practice-task-list";
import styles from "../practice-catalog-page.module.css";

export const PracticeResults: React.FC<PracticeCatalogPageTypes.Props> = (
  props,
) => {
  const router = useRouter();
  if (props.result.status === "unavailable")
    return (
      <section className={styles.table} role="alert">
        <div className={styles.alertState}>
          <Typography.Title order={2} className={styles.alertTitle}>
            Не удалось загрузить задачи
          </Typography.Title>
          <Typography.Text>Попробуйте ещё раз немного позже.</Typography.Text>
          <Button
            hierarchy="secondary"
            onClick={() => {
              void router.invalidate();
            }}
          >
            Повторить загрузку
          </Button>
        </div>
      </section>
    );
  if (props.result.status === "invalid")
    return (
      <section className={styles.table} role="alert">
        <div className={styles.alertState}>
          <Typography.Title order={2} className={styles.alertTitle}>
            Не удалось применить фильтры
          </Typography.Title>
          <Typography.Text>
            Проверьте значения или начните поиск заново.
          </Typography.Text>
          <ActionLink
            to="/practice"
            presentation="button"
            hierarchy="secondary"
          >
            Сбросить фильтры
          </ActionLink>
        </div>
      </section>
    );
  const page = props.result.page;
  if (!page) return null;
  return (
    <>
      {/* F48 (К3): the table hangs under the filter panel, in one frame. */}
      <div className={styles.table}>
        <div className={styles.resultBar}>
          <Typography.Text variant="caption">
            Найдено {practiceCatalog.countLabel(page.total)}
          </Typography.Text>
        </div>
        {/* F46 (П13): the empty result composed as on /ege (F45). */}
        {!page.tasks.length && (
          <div className={styles.state} role="status">
            <MascotScene
              scene="empty-search"
              className={styles.stateIllustration}
            />
            <EmptyState
              title={
                page.total > 0 ? "Здесь задач уже нет" : "Ничего не нашлось"
              }
              description={resultsModel.emptyText(props.search, page.total)}
              action={
                page.total > 0 ? (
                  <ActionLink
                    to={practiceCatalog.href({
                      ...props.search,
                      page: Math.ceil(page.total / (page.limit ?? 30)),
                    })}
                    presentation="button"
                    hierarchy="primary"
                  >
                    На последнюю страницу
                  </ActionLink>
                ) : (
                  <ActionLink
                    to="/practice"
                    presentation="button"
                    hierarchy="primary"
                  >
                    Сбросить фильтры
                  </ActionLink>
                )
              }
            />
          </div>
        )}
        <PracticeTaskList
          tasks={page.tasks}
          search={props.search}
          skills={props.result.facets?.skills ?? []}
          topics={props.result.facets?.topics}
        />
      </div>
      {page.total > 0 && (
        <PracticePagination search={props.search} page={page} />
      )}
    </>
  );
};

const resultsModel = {
  emptyText: (
    search: PracticeCatalogPageTypes.Props["search"],
    total: number,
  ) => {
    if (total > 0)
      return "Эта страница за концом списка — задачи на предыдущих.";
    if (search.q) return "Попробуйте другие слова или номер задачи.";
    return "Снимите один из фильтров или выберите другую тему.";
  },
};
