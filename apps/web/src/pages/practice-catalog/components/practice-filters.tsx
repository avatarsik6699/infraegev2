import {
  practiceCatalog,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { SelectField } from "~/shared/components/select-field";
import { Button } from "~/shared/components/button";
import { ActionLink } from "~/shared/components/action-link";
import styles from "../practice-catalog-page.module.css";

export const PracticeFilters: React.FC<{
  search: PracticeCatalogTypes.Search;
  facets: PracticeCatalogTypes.Facets | null;
}> = (props) => (
  <section className={styles.filterPanel} aria-label="Выбор задач">
    <form
      action="/practice"
      method="get"
      className={styles.actions}
      aria-label="Номер ЕГЭ"
    >
      {props.search.skill && (
        <input type="hidden" name="skill" value={props.search.skill} />
      )}
      {props.search.difficulty && (
        <input
          type="hidden"
          name="difficulty"
          value={props.search.difficulty}
        />
      )}
      <Button
        type="submit"
        name="exam_number"
        value=""
        aria-pressed={!props.search.exam_number}
        hierarchy={!props.search.exam_number ? "primary" : "quiet"}
      >
        Все
      </Button>
      {props.facets?.exam_numbers.map((number) => (
        <Button
          key={number}
          type="submit"
          name="exam_number"
          value={number}
          aria-pressed={props.search.exam_number === number}
          hierarchy={props.search.exam_number === number ? "primary" : "quiet"}
        >
          №{number}
        </Button>
      ))}
    </form>
    {/* Native disclosure may be opened by the learner before hydration. */}
    <details className={styles.advanced} suppressHydrationWarning>
      <summary>Дополнительные фильтры</summary>
      <form
        action="/practice"
        method="get"
        className={styles.filters}
        aria-label="Фильтры задач"
      >
        {props.search.exam_number && (
          <input
            type="hidden"
            name="exam_number"
            value={props.search.exam_number}
          />
        )}
        <SelectField
          label="Навык"
          name="skill"
          defaultValue={props.search.skill ?? ""}
          options={[
            { value: "", label: "Любой навык" },
            ...(props.facets?.skills ?? []),
          ]}
        />
        <SelectField
          label="Сложность"
          name="difficulty"
          defaultValue={props.search.difficulty ?? ""}
          options={[
            { value: "", label: "Любая сложность" },
            ...(props.facets?.difficulties ?? []).map((number) => ({
              value: String(number),
              label: practiceCatalog.difficultyLabel(number),
            })),
          ]}
        />
        <Button type="submit">Применить</Button>
      </form>
    </details>
    {(props.search.exam_number ||
      props.search.skill ||
      props.search.difficulty) && (
      <nav className={styles.actions} aria-label="Выбранные фильтры">
        {props.search.exam_number && (
          <ActionLink
            hierarchy="quiet"
            to={practiceCatalog.href({
              ...props.search,
              exam_number: undefined,
              page: undefined,
            })}
          >
            Убрать №{props.search.exam_number}
          </ActionLink>
        )}
        {props.search.skill && (
          <ActionLink
            hierarchy="quiet"
            to={practiceCatalog.href({
              ...props.search,
              skill: undefined,
              page: undefined,
            })}
          >
            Убрать навык:{" "}
            {props.facets?.skills.find(
              (skill) => skill.value === props.search.skill,
            )?.label ?? "выбранный навык"}
          </ActionLink>
        )}
        {props.search.difficulty && (
          <ActionLink
            hierarchy="quiet"
            to={practiceCatalog.href({
              ...props.search,
              difficulty: undefined,
              page: undefined,
            })}
          >
            Убрать сложность:{" "}
            {practiceCatalog.difficultyLabel(props.search.difficulty)}
          </ActionLink>
        )}
        <ActionLink to="/practice" hierarchy="quiet">
          Сбросить всё
        </ActionLink>
      </nav>
    )}
  </section>
);
