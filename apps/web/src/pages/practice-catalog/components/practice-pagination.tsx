import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import {
  practiceCatalog,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { ActionLink } from "~/shared/components/action-link";
import { InlineSelect } from "~/shared/components/inline-select";
import { practicePagination } from "../model/practice-pagination";
import { Button } from "~/shared/components/button";
import { useRouter } from "@tanstack/react-router";
import { formValues } from "~/shared/lib/form-values";
import styles from "../practice-catalog-page.module.css";
export const PracticePagination: React.FC<{
  search: PracticeCatalogTypes.Search;
  page: PracticeCatalogTypes.Page;
}> = (props) => {
  const router = useRouter();
  const total = Math.max(
    1,
    Math.ceil(props.page.total / (props.page.limit ?? 30)),
  );
  const current = props.page.page;
  const pages = practicePagination.pages(current, total);
  return (
    <div className={styles.paginationBar}>
      <nav className={styles.pagination} aria-label="Страницы задач">
        {current > 1 ? (
          <ActionLink
            presentation="navigation"
            hierarchy="quiet"
            ariaLabel="Предыдущая страница"
            to={practiceCatalog.href({ ...props.search, page: current - 1 })}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </ActionLink>
        ) : (
          <span aria-disabled="true" aria-label="Предыдущая страница">
            <ChevronLeft size={16} />
          </span>
        )}
        {pages.map((page, index) => (
          <span key={page} className={styles.pageGroup}>
            {index > 0 && page - pages[index - 1] > 1 && (
              <ActionLink
                presentation="navigation"
                hierarchy="quiet"
                ariaLabel={`Перейти на страницу ${Math.floor((page + pages[index - 1]) / 2)}`}
                title={`Страница ${Math.floor((page + pages[index - 1]) / 2)}`}
                to={practiceCatalog.href({
                  ...props.search,
                  page: Math.floor((page + pages[index - 1]) / 2),
                })}
              >
                <Ellipsis size={16} aria-hidden="true" />
              </ActionLink>
            )}
            <ActionLink
              presentation="navigation"
              hierarchy="quiet"
              ariaLabel={`Страница ${page}`}
              aria-current={page === current ? "page" : undefined}
              to={practiceCatalog.href({ ...props.search, page })}
            >
              {page}
            </ActionLink>
          </span>
        ))}
        {current < total ? (
          <ActionLink
            presentation="navigation"
            hierarchy="quiet"
            ariaLabel="Следующая страница"
            to={practiceCatalog.href({ ...props.search, page: current + 1 })}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </ActionLink>
        ) : (
          <span aria-disabled="true" aria-label="Следующая страница">
            <ChevronRight size={16} />
          </span>
        )}
      </nav>
      <form
        id="practice-pagination-limit"
        action="/practice"
        method="get"
        className={styles.limitForm}
        onSubmit={(event) => {
          event.preventDefault();
          void router.navigate({
            to: "/practice",
            search: practiceCatalog.search(
              formValues.read(event.currentTarget),
            ),
            resetScroll: false,
          });
        }}
      >
        {[
          ...new URLSearchParams(
            practiceCatalog
              .href({ ...props.search, page: undefined, limit: undefined })
              .split("?")[1],
          ),
        ].map(([name, value], index) => (
          <input
            key={`${name}-${index}`}
            type="hidden"
            name={name}
            value={value}
          />
        ))}
        <InlineSelect
          key={props.page.limit ?? 30}
          form="practice-pagination-limit"
          label="На странице"
          name="limit"
          defaultValue={String(props.page.limit ?? 30)}
          options={[10, 30, 50, 100].map((limit) => ({
            value: String(limit),
            label: String(limit),
          }))}
        />
        <noscript>
          <Button type="submit" hierarchy="quiet">
            Применить
          </Button>
        </noscript>
      </form>
    </div>
  );
};
