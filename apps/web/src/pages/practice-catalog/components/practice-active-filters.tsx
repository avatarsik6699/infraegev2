import { X } from "lucide-react";
import {
  practiceCatalog,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { ActionLink } from "~/shared/components/action-link";
import styles from "../practice-catalog-page.module.css";

export const PracticeActiveFilters: React.FC<{
  search: PracticeCatalogTypes.Search;
  facets: PracticeCatalogTypes.Facets | null;
}> = (props) => {
  const filters = [
    ...(props.search.q
      ? [
          {
            label: props.search.q,
            action: `Убрать поиск: ${props.search.q}`,
            search: { ...props.search, q: undefined },
          },
        ]
      : []),
    ...(props.search.topics ?? []).map((topic) => {
      const label =
        props.facets?.topics?.find((item) => item.id === topic)?.label ?? topic;
      return {
        label,
        action: `Убрать тему: ${label}`,
        search: {
          ...props.search,
          topics: props.search.topics?.filter((item) => item !== topic),
        },
      };
    }),
    ...(props.search.exam_number
      ? [
          {
            label: `№${props.search.exam_number}`,
            action: `Убрать №${props.search.exam_number}`,
            search: { ...props.search, exam_number: undefined },
          },
        ]
      : []),
    ...(props.search.skill
      ? [
          {
            label:
              props.facets?.skills.find(
                (item) => item.value === props.search.skill,
              )?.label ?? "Выбранный навык",
            action: "Убрать навык",
            search: { ...props.search, skill: undefined },
          },
        ]
      : []),
    ...(props.search.difficulty
      ? [
          {
            label: practiceCatalog.difficultyLabel(props.search.difficulty),
            action: "Убрать сложность",
            search: { ...props.search, difficulty: undefined },
          },
        ]
      : []),
  ];
  if (!filters.length) return null;
  return (
    <nav className={styles.activeFilters} aria-label="Применённые фильтры">
      {filters.map((filter) => (
        <span className={styles.filterChip} key={filter.action}>
          {filter.label}
          <ActionLink
            hierarchy="quiet"
            presentation="navigation"
            className={styles.removeFilter}
            ariaLabel={filter.action}
            to={practiceCatalog.href({ ...filter.search, page: undefined })}
          >
            <X size={12} aria-hidden="true" />
          </ActionLink>
        </span>
      ))}
      <ActionLink
        to="/practice"
        hierarchy="quiet"
        presentation="button"
        className={styles.resetFilters}
      >
        Сбросить всё
      </ActionLink>
    </nav>
  );
};
