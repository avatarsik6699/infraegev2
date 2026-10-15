import { useRouter } from "@tanstack/react-router";
import { formValues } from "~/shared/lib/form-values";
import patterns from "~/shared/styles/patterns.module.css";
import { useEffect, useRef, useState } from "react";
import {
  practiceCatalog,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { useAccountSession } from "~/features/account";
import { usePracticeProgress } from "~/features/practice-progress";
import { InlineSelect } from "~/shared/components/inline-select";
import { MultiCombobox } from "~/shared/components/multi-combobox";
import { SearchField } from "~/shared/components/search-field";
import { Button } from "~/shared/components/button";
import { russianCount } from "~/shared/lib/russian-count";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { PracticeActiveFilters } from "./practice-active-filters";
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
  const session = useAccountSession();
  const member = session.status === "ready" && Boolean(session.account);
  const hydrated = usePracticeProgress((state) => state.hydrated);
  const history = usePracticeProgress((state) => state.history);
  const examNumbers = usePracticeProgress((state) => state.examNumbers);
  // F48 (П8): only topics with tasks; the rest is one line under the list.
  const options = (props.facets?.topics ?? []).filter(
    (topic) => topic.count > 0 || props.search.topics?.includes(topic.id),
  );
  const empty = (props.facets?.topics ?? []).length - options.length;
  const solvedIn = (topic: PracticeCatalogTypes.Topic) =>
    Object.keys(examNumbers).filter(
      (id) =>
        history[id] &&
        topic.exam_number != null &&
        examNumbers[id].includes(topic.exam_number),
    ).length;
  return (
    <form
      ref={form}
      id="practice-filters"
      action="/practice"
      method="get"
      className={styles.panel}
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
        labelVisibility="sr-only"
        name="q"
        placeholder="Название, условие или номер"
        maxLength={200}
        defaultValue={props.search.q ?? ""}
        submitLabel="Найти задачи"
        clearLabel="Очистить поиск"
      />
      <div className={styles.panelSelects}>
        <div className={patterns.scriptedOnly}>
          <MultiCombobox
            presentation="inline"
            note={
              empty > 0
                ? `Ещё ${russianCount.of(empty, ["тема", "темы", "тем"])} — задачи скоро`
                : undefined
            }
            label="Тема"
            emptySelectionLabel="Все темы"
            selectedLabel={`Выбрано тем: ${props.search.topics?.length ?? 0}`}
            searchPlaceholder="Найти тему"
            emptyLabel="Темы не найдены"
            options={options.map((topic) => ({
              value: topic.id,
              label: practiceCatalog.topicLabel(topic.label),
              group: topic.group,
              description:
                member && hydrated && topic.exam_number != null
                  ? `${practiceCatalog.countLabel(topic.count)} · решено ${String(solvedIn(topic))}`
                  : practiceCatalog.countLabel(topic.count),
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
              {[...new Set(options.map((topic) => topic.group))].map(
                (group) => (
                  <optgroup key={group} label={group}>
                    {options
                      .filter((topic) => topic.group === group)
                      .map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {practiceCatalog.topicLabel(topic.label)} —{" "}
                          {practiceCatalog.countLabel(topic.count)}
                        </option>
                      ))}
                  </optgroup>
                ),
              )}
            </select>
            <Button type="submit" hierarchy="secondary">
              Применить
            </Button>
          </label>
        </noscript>
        <InlineSelect
          label="Сложность"
          form="practice-filters"
          name="difficulty"
          defaultValue={String(props.search.difficulty ?? "")}
          options={[
            { value: "", label: "Любая" },
            ...[1, 2, 3].map((level) => ({
              value: String(level),
              label: practiceCatalog.difficultyLabel(level),
            })),
          ]}
        />
        <InlineSelect
          label="Сортировка"
          name="sort"
          form="practice-filters"
          defaultValue={props.search.sort ?? "default"}
          options={[
            { value: "default", label: "По номеру" },
            { value: "difficulty_asc", label: "Сначала простые" },
            { value: "difficulty_desc", label: "Сначала сложные" },
          ]}
        />
      </div>
      <PracticeActiveFilters search={props.search} facets={props.facets} />
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
      {props.search.limit && (
        <input type="hidden" name="limit" value={props.search.limit} />
      )}
    </form>
  );
};
