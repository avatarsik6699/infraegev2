import { useState, type ReactNode } from "react";
import { Typography } from "~/shared/components/typography";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { PracticeTaskContent } from "./practice-task-content";
import styles from "../lesson-practice.module.css";
export const PracticeCatalogHelp: React.FC<{
  task: PracticeTaskTypes.Task;
  children: ReactNode;
  enabled: boolean;
  headingOrder?: 2 | 3 | 4;
}> = (props) => {
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  if (!props.enabled) return props.children;
  return (
    <>
      <div className={styles.catalogToolbar}>
        {props.children}
        <div className={styles.catalogHelpActions}>
          <Button
            hierarchy="soft"
            aria-expanded={hint}
            aria-controls={`hint-${props.task.id}`}
            onClick={() => setHint(!hint)}
          >
            {hint ? "Скрыть подсказку" : "Подсказка"}
          </Button>
          <Button
            hierarchy="soft"
            aria-expanded={solution}
            aria-controls={`solution-${props.task.id}`}
            onClick={() => setSolution(!solution)}
          >
            {solution ? "Скрыть решение" : "Решение"}
          </Button>
        </div>
      </div>
      <div
        className={styles.catalogHelpPanel}
        id={`hint-${props.task.id}`}
        hidden={!hint}
      >
        <Typography.Title
          order={props.headingOrder ?? 4}
          className={styles.helpTitle}
        >
          Подсказка
        </Typography.Title>
        <PracticeTaskContent blocks={props.task.hint} context="hint" />
      </div>
      <div
        className={styles.catalogHelpPanel}
        id={`solution-${props.task.id}`}
        hidden={!solution}
      >
        <Typography.Title
          order={props.headingOrder ?? 4}
          className={styles.helpTitle}
        >
          Решение
        </Typography.Title>
        <PracticeTaskContent blocks={props.task.solution} context="solution" />
      </div>
    </>
  );
};
