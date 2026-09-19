import { InlineSelect } from "~/shared/components/inline-select";
import { PracticePagination } from "./practice-pagination";
import { useRouter } from "@tanstack/react-router";
import { practiceCatalog } from "~/entities/practice-task";
import { Typography } from "~/shared/components/typography";
import { EmptyState } from "~/shared/components/empty-state";
import { Button } from "~/shared/components/button";
import { ActionLink } from "~/shared/components/action-link";
import type { PracticeCatalogPageTypes } from "../practice-catalog-page.types";
import { PracticeActiveFilters } from "./practice-active-filters";
import { PracticeTaskList } from "./practice-task-list";
import styles from "../practice-catalog-page.module.css";

export const PracticeResults: React.FC<PracticeCatalogPageTypes.Props> = (
  props,
) => {
  const router = useRouter();
  if (props.result.status === "unavailable")
    return (
      <section className={styles.state} role="alert">
        <Typography.Title order={2}>
          Не удалось загрузить задачи
        </Typography.Title>
        <Typography.Text>Попробуйте ещё раз немного позже.</Typography.Text>
        <Button
          onClick={() => {
            void router.invalidate();
          }}
        >
          Повторить загрузку
        </Button>
      </section>
    );
  if (props.result.status === "invalid")
    return (
      <section className={styles.state} role="alert">
        <Typography.Title order={2}>
          Не удалось применить фильтры
        </Typography.Title>
        <Typography.Text>
          Проверьте значения или начните поиск заново.
        </Typography.Text>
        <ActionLink to="/practice" presentation="button">
          Сбросить фильтры
        </ActionLink>
      </section>
    );
  const page = props.result.page;
  if (!page) return null;
  return (
    <>
      <div className={styles.resultBar}>
        <Typography.Text variant="caption">
          Найдено {practiceCatalog.countLabel(page.total)}
        </Typography.Text>
        <PracticeActiveFilters
          search={props.search}
          facets={props.result.facets}
        />
        <div className={styles.sort}>
          <InlineSelect
            label="Сортировка"
            name="sort"
            form="practice-filters"
            defaultValue={props.search.sort ?? "default"}
            options={[
              { value: "default", label: "По умолчанию" },
              { value: "difficulty_asc", label: "Сначала простые" },
              { value: "difficulty_desc", label: "Сначала сложные" },
            ]}
          />
        </div>
      </div>
      {!page.tasks.length && (
        <div className={styles.state}>
          <EmptyState
            title="Пока ничего не нашлось"
            description="Попробуйте другие слова или выберите другую тему."
          />
          {page.total > 0 ? (
            <ActionLink
              to={practiceCatalog.href({
                ...props.search,
                page: Math.ceil(page.total / (page.limit ?? 30)),
              })}
            >
              На последнюю страницу
            </ActionLink>
          ) : (
            <ActionLink to="/practice" presentation="button">
              Сбросить фильтры
            </ActionLink>
          )}
        </div>
      )}
      <PracticeTaskList
        tasks={page.tasks}
        search={props.search}
        skills={props.result.facets?.skills ?? []}
        topics={props.result.facets?.topics}
      />
      <PracticePagination search={props.search} page={page} />
    </>
  );
};
