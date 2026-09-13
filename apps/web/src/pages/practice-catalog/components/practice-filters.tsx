import type { PracticeCatalogTypes } from "~/entities/practice-task";
import { Field } from "~/shared/components/field";
import { Button } from "~/shared/components/button";
import { ActionLink } from "~/shared/components/action-link";
import styles from "../practice-catalog-page.module.css";

export const PracticeFilters: React.FC<{
  search: PracticeCatalogTypes.Search;
}> = (props) => (
  <form
    action="/practice"
    method="get"
    className={styles.filters}
    aria-label="Фильтры задач"
  >
    <Field
      label="Навык"
      name="skill"
      id="practice-skill"
      defaultValue={props.search.skill ?? ""}
      placeholder="Например, python"
      maxLength={120}
    />
    <Field
      label="Номер ЕГЭ"
      name="exam_number"
      id="practice-exam"
      type="number"
      min={1}
      max={27}
      defaultValue={props.search.exam_number ?? ""}
      placeholder="Любой"
    />
    <Field
      label="Сложность: от 1 до 3"
      name="difficulty"
      id="practice-difficulty"
      type="number"
      min={1}
      max={3}
      defaultValue={props.search.difficulty ?? ""}
      placeholder="Любая"
    />
    <div className={styles.actions}>
      <Button type="submit">Применить</Button>
      <ActionLink to="/practice" hierarchy="quiet">
        Сбросить
      </ActionLink>
    </div>
  </form>
);
