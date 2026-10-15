import { useState } from "react";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import type { PracticeCatalogTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { PracticeCatalogRow } from "./practice-catalog-row";
import { PracticeTopicGroup } from "./practice-topic-group";
import styles from "../practice-catalog-page.module.css";

export const PracticeTaskList: React.FC<{
  tasks: PracticeCatalogTypes.Entry[];
  search: PracticeCatalogTypes.Search;
  skills: PracticeCatalogTypes.Facets["skills"];
  topics?: PracticeCatalogTypes.Topic[];
}> = (props) => {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const enhanced = useIsEnhanced();
  if (!props.tasks.length) return null;
  const allOpen = props.tasks.every((task) => expanded.has(task.id));
  // F47: ordered by number, each number opens with its topic row.
  const grouped = (props.search.sort ?? "default") === "default";
  const numberOf = (task?: PracticeCatalogTypes.Entry) => task?.exam_numbers[0];
  const groupAt = (index: number) => {
    const number = numberOf(props.tasks[index]);
    if (!grouped || number === undefined) return null;
    if (index > 0 && numberOf(props.tasks[index - 1]) === number) return null;
    return (
      <PracticeTopicGroup
        number={number}
        total={
          props.topics?.find((topic) => topic.id === `ege-${String(number)}`)
            ?.count ?? 0
        }
        pageTasks={props.tasks.filter((item) => numberOf(item) === number)}
      />
    );
  };

  return (
    <>
      <div className={styles.listHeading}>
        <span aria-hidden="true" />
        <span aria-hidden="true">Задание</span>
        <span aria-hidden="true">Тема</span>
        <span aria-hidden="true">Сложность</span>
        <span aria-hidden="true">Источник</span>
        <div className={styles.scriptedOnly}>
          <Button
            className={styles.bulkToggle}
            hierarchy="quiet"
            surface="bare"
            density="compact"
            iconOnly
            disabled={!enhanced}
            aria-label={allOpen ? "Свернуть все" : "Раскрыть все"}
            title={allOpen ? "Свернуть все" : "Раскрыть все"}
            aria-expanded={allOpen}
            iconStart={
              allOpen ? (
                <ChevronsUp size={18} aria-hidden="true" />
              ) : (
                <ChevronsDown size={18} aria-hidden="true" />
              )
            }
            onClick={() =>
              setExpanded(
                allOpen
                  ? new Set()
                  : new Set(props.tasks.map((task) => task.id)),
              )
            }
          />
        </div>
      </div>
      <ul className={styles.list} aria-label="Задачи">
        {props.tasks.map((task, index) => (
          <PracticeCatalogRow
            key={task.id}
            group={groupAt(index)}
            headingOrder={grouped && numberOf(task) !== undefined ? 3 : 2}
            task={task}
            search={props.search}
            skills={props.skills}
            topics={props.topics}
            open={expanded.has(task.id)}
            onToggle={() =>
              setExpanded((current) => {
                const next = new Set(current);
                if (next.has(task.id)) next.delete(task.id);
                else next.add(task.id);
                return next;
              })
            }
          />
        ))}
      </ul>
    </>
  );
};
