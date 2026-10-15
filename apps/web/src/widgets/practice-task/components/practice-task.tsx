import { useState } from "react";
import {
  StandalonePractice,
  checkPracticeAnswer,
  createCheckAndSaveAnswer,
  STANDALONE_CONTEXT_ID,
} from "~/features/lesson-practice";
import { useAccountSession } from "~/features/account";
import { usePracticeProgress } from "~/features/practice-progress";
import { ActionLink } from "~/shared/components/action-link";
import { PracticeTheory } from "./practice-theory";
import type { PracticeTaskWidgetTypes } from "../practice-task.types";
import styles from "../practice-task.module.css";

export const PracticeTask: React.FC<PracticeTaskWidgetTypes.Props> = (
  props,
) => {
  const history = usePracticeProgress((state) => state.history[props.task.id]);
  const session = useAccountSession();
  const markSolved = usePracticeProgress((state) => state.markSolved);
  const hydrated = usePracticeProgress((state) => state.hydrated);
  const [attempt, setAttempt] = useState(0);
  const [repeating, setRepeating] = useState(false);
  const solved = history?.[props.task.solutionRevision] === true;
  return (
    <section
      className={styles.solving}
      data-presentation={props.presentation ?? "detail"}
      aria-label="Решение задачи"
    >
      {props.presentation === "catalog" && (
        <header className={styles.catalogHeader}>
          {props.taskHref ? (
            <ActionLink
              presentation="reference"
              to={props.taskHref}
              ariaLabel={`Открыть задачу ${props.task.id.slice(0, 8)} на отдельной странице`}
            >
              {`Задача ${props.task.id.slice(0, 8)}`}
            </ActionLink>
          ) : (
            <span />
          )}
          <PracticeTheory links={props.links} />
        </header>
      )}
      <StandalonePractice
        helpHeadingOrder={props.presentation === "catalog" ? 4 : 2}
        key={attempt}
        focusOnMount={repeating}
        active={props.active}
        onRepeat={
          hydrated && solved
            ? () => {
                setRepeating(true);
                setAttempt((value) => value + 1);
              }
            : undefined
        }
        tasks={[props.task]}
        checkAnswer={
          session.account && props.saveProgress !== false
            ? createCheckAndSaveAnswer(
                "standalone",
                STANDALONE_CONTEXT_ID,
                session.csrfToken,
              )
            : checkPracticeAnswer
        }
        solvedTaskIds={solved && !repeating ? [props.task.id] : []}
        onTaskSolved={(id) => {
          markSolved(id, props.task.solutionRevision);
          setRepeating(false);
          return 1;
        }}
        onRefresh={props.onRefresh}
      />
    </section>
  );
};
