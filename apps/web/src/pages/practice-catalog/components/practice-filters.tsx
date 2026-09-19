import { useRouter } from "@tanstack/react-router";
import { formValues } from "~/shared/lib/form-values";
import patterns from "~/shared/styles/patterns.module.css";
import { useEffect, useRef, useState } from "react";
import {
  practiceCatalog,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { MultiCombobox } from "~/shared/components/multi-combobox";
import { SearchField } from "~/shared/components/search-field";
import { Button } from "~/shared/components/button";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "../practice-catalog-page.module.css";

export const PracticeFilters: React.FC<{
  search: PracticeCatalogTypes.Search;
  facets: PracticeCatalogTypes.Facets | null;
}> = (props) => {
  const router = useRouter();
  const enhanced = useIsEnhanced();
  const form = useRef<HTMLFormElement>(null);
  const [topics, setTopics] = useState(props.search.topics ?? []);
  const [applyVersion, setApplyVersion] = useState(0);
  useEffect(
    function applyTopicsFx() {
      if (applyVersion) form.current?.requestSubmit();
    },
    [applyVersion],
  );
  const options = props.facets?.topics ?? [];
  return (
    <form
      ref={form}
      id="practice-filters"
      action="/practice"
      method="get"
      className={styles.filters}
      aria-label="Фильтры задач"
      onSubmit={(event) => {
        event.preventDefault();
        void router.navigate({
          to: "/practice",
          search: practiceCatalog.search(formValues.read(event.currentTarget)),
          resetScroll: false,
        });
      }}
    >
      <SearchField
        label="Поиск задач"
        name="q"
        placeholder="Название, условие или номер"
        maxLength={200}
        defaultValue={props.search.q ?? ""}
        submitLabel="Найти задачи"
        clearLabel="Очистить поиск"
      />
      <div className={patterns.scriptedOnly}>
        <MultiCombobox
          label="Тема"
          emptySelectionLabel="Все темы"
          selectedLabel={`Выбрано тем: ${props.search.topics?.length ?? 0}`}
          searchPlaceholder="Найти тему"
          emptyLabel="Темы не найдены"
          options={options.map((topic) => ({
            value: topic.id,
            label: topic.label,
            group: topic.group,
            description: practiceCatalog.countLabel(topic.count),
          }))}
          value={props.search.topics ?? []}
          onApply={(next) => {
            setTopics(next);
            setApplyVersion((value) => value + 1);
          }}
        />
      </div>
      <noscript>
        <label className={styles.nativeTopics}>
          Тема
          <select
            aria-label="Тема"
            name="topics"
            multiple
            defaultValue={topics}
          >
            {[...new Set(options.map((topic) => topic.group))].map((group) => (
              <optgroup key={group} label={group}>
                {options
                  .filter((topic) => topic.group === group)
                  .map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.label} — {practiceCatalog.countLabel(topic.count)}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <Button type="submit" hierarchy="secondary">
            Применить
          </Button>
        </label>
      </noscript>
      {topics.map((topic) => (
        <input
          key={topic}
          type="hidden"
          name="topics"
          value={topic}
          disabled={!enhanced}
        />
      ))}
      {props.search.skill && (
        <input type="hidden" name="skill" value={props.search.skill} />
      )}
      {props.search.exam_number && (
        <input
          type="hidden"
          name="exam_number"
          value={props.search.exam_number}
        />
      )}
      {props.search.difficulty && (
        <input
          type="hidden"
          name="difficulty"
          value={props.search.difficulty}
        />
      )}
      {props.search.limit && (
        <input type="hidden" name="limit" value={props.search.limit} />
      )}
    </form>
  );
};
