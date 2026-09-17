import { useRouter } from "@tanstack/react-router";
import { practiceCatalog } from "~/entities/practice-task";
import { Typography } from "~/shared/components/typography";
import { EmptyState } from "~/shared/components/empty-state";
import { Button } from "~/shared/components/button";
import { ActionLink } from "~/shared/components/action-link";
import type { PracticeCatalogPageTypes } from "../practice-catalog-page.types";
import { PracticeCatalogRow } from "./practice-catalog-row";
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
        <ActionLink to="/practice">Сбросить фильтры</ActionLink>
      </section>
    );
  const page = props.result.page;
  if (!page?.tasks.length)
    return (
      <div className={styles.state}>
        <EmptyState
          title={
            props.search.cursor ||
            props.search.skill ||
            props.search.exam_number ||
            props.search.difficulty
              ? "По этим фильтрам задач пока нет"
              : "Задачи для самостоятельной практики пока не опубликованы"
          }
          description={
            props.result.facets?.total
              ? "Снимите ограничения, чтобы увидеть другие задачи."
              : "Практические задания доступны внутри уроков."
          }
        />
        <ActionLink
          to={props.result.facets?.total ? "/practice" : "/courses"}
          hierarchy="drawn"
        >
          {props.result.facets?.total
            ? "Сбросить фильтры"
            : "Перейти к мини-курсам"}
        </ActionLink>
      </div>
    );
  return (
    <>
      <Typography.Text tone="muted" variant="caption">
        Найдено задач: {page.total}. Сначала новые.
      </Typography.Text>
      <ul className={styles.list} aria-label="Задачи">
        {page.tasks.map((task) => (
          <PracticeCatalogRow key={task.id} task={task} search={props.search} />
        ))}
      </ul>
      <Typography.Text tone="muted" variant="caption">
        Отметки решения сохраняются в этом браузере отдельно от уроков.
      </Typography.Text>
      <nav className={styles.actions} aria-label="Страницы задач">
        {props.search.cursor && (
          <ActionLink
            to={practiceCatalog.href({ ...props.search, cursor: undefined })}
          >
            К началу списка
          </ActionLink>
        )}
        {page.next_cursor && (
          <ActionLink
            to={practiceCatalog.href({
              ...props.search,
              cursor: page.next_cursor,
            })}
            hierarchy="drawn"
            icon="forward"
          >
            Следующие задачи
          </ActionLink>
        )}
      </nav>
    </>
  );
};
