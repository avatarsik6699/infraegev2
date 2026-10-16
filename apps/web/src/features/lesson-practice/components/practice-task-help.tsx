import { useState, type ReactNode } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { PracticeTaskContent } from "./practice-task-content";
import styles from "../lesson-practice.module.css";

const SOLUTION_TITLE = {
  method: "Идея решения",
  worked_solution: "Решение",
  unclassified: "Разбор",
} as const;

/**
 * F30: one row everywhere — the answer form (children), then «Подсказка» and
 * «Решение» toggles; their panels open below. Without JavaScript the
 * toggles hide and available panels show (see the `scripting: none` rule).
 * Absent help is omitted from the HTML in every rendering mode.
 */
export const PracticeTaskHelp: React.FC<{
  task: PracticeTaskTypes.Task;
  children: ReactNode;
  headingOrder?: 2 | 3 | 4;
}> = (props) => {
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  // A click before hydration would be lost; like «Проверить», wait for it.
  const enhanced = useIsEnhanced();
  const hasHint = props.task.hint.length > 0;
  const hasSolution = props.task.solution.length > 0;
  const solutionTitle =
    SOLUTION_TITLE[props.task.explanationKind ?? "unclassified"];
  return (
    <>
      <div className={styles.taskToolbar}>
        {props.children}
        {(hasHint || hasSolution) && (
          <div className={styles.helpActions}>
            {hasHint && (
              <Button
                hierarchy="soft"
                disabled={!enhanced}
                aria-expanded={hint}
                aria-controls={`hint-${props.task.id}`}
                onClick={() => setHint(!hint)}
              >
                <span className={styles.helpLabel}>
                  <span className={styles.helpLabelReserve} aria-hidden="true">
                    Скрыть подсказку
                  </span>
                  <span>{hint ? "Скрыть подсказку" : "Подсказка"}</span>
                </span>
              </Button>
            )}
            {hasSolution && (
              <Button
                hierarchy="soft"
                disabled={!enhanced}
                aria-expanded={solution}
                aria-controls={`solution-${props.task.id}`}
                onClick={() => setSolution(!solution)}
              >
                <span className={styles.helpLabel}>
                  <span className={styles.helpLabelReserve} aria-hidden="true">
                    Скрыть решение
                  </span>
                  <span>{solution ? "Скрыть решение" : "Решение"}</span>
                </span>
              </Button>
            )}
          </div>
        )}
      </div>
      {hasHint && (
        <div
          className={styles.helpPanel}
          id={`hint-${props.task.id}`}
          hidden={!hint}
          data-practice-help="hint"
        >
          <Typography.Title
            order={props.headingOrder ?? 4}
            className={styles.helpTitle}
          >
            Подсказка
          </Typography.Title>
          <PracticeTaskContent blocks={props.task.hint} context="hint" />
        </div>
      )}
      {hasSolution && (
        <div
          className={styles.helpPanel}
          id={`solution-${props.task.id}`}
          hidden={!solution}
          data-practice-help="solution"
        >
          <Typography.Title
            order={props.headingOrder ?? 4}
            className={styles.helpTitle}
          >
            {solutionTitle}
          </Typography.Title>
          <PracticeTaskContent
            blocks={props.task.solution}
            context="solution"
          />
        </div>
      )}
    </>
  );
};
