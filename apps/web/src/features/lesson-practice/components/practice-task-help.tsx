import { useState, type ReactNode } from "react";
import {
  getTaskSolution,
  type PracticeTaskTypes,
} from "~/entities/practice-task";
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
  // Change 198: a paid task's solution arrives only when «Решение» is pressed.
  const [loaded, setLoaded] = useState<
    readonly PracticeTaskTypes.ContentBlock[] | "loading" | "failed" | null
  >(null);
  const hasHint = props.task.hint.length > 0;
  const hasSolution =
    props.task.solution.length > 0 || props.task.solutionOnRequest === true;
  const solutionBlocks = Array.isArray(loaded) ? loaded : props.task.solution;
  const toggleSolution = () => {
    setSolution(!solution);
    if (!props.task.solutionOnRequest || solution) return;
    if (Array.isArray(loaded) || loaded === "loading") return;
    setLoaded("loading");
    getTaskSolution({ data: props.task.id }).then(setLoaded, () =>
      setLoaded("failed"),
    );
  };
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
                onClick={toggleSolution}
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
          {loaded === "loading" ? (
            <Typography.Text tone="muted" role="status">
              Загружаем решение…
            </Typography.Text>
          ) : null}
          {loaded === "failed" ? (
            <Typography.Text tone="muted" role="alert">
              Не удалось загрузить решение. Попробуйте ещё раз позже.
            </Typography.Text>
          ) : null}
          <PracticeTaskContent blocks={solutionBlocks} context="solution" />
        </div>
      )}
    </>
  );
};
