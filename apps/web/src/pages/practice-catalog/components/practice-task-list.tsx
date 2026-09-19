import { useState } from "react";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import type { PracticeCatalogTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { PracticeCatalogRow } from "./practice-catalog-row";
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

  return (
    <>
      <div className={styles.listHeading}>
        <span aria-hidden="true">Задание</span>
        <span aria-hidden="true">Тема</span>
        <span aria-hidden="true">Сложность</span>
        <span aria-hidden="true">Формат</span>
        <span aria-hidden="true">Источник</span>
        <span aria-hidden="true" />
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
        {props.tasks.map((task) => (
          <PracticeCatalogRow
            key={task.id}
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
