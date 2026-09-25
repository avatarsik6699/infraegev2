import { useState } from "react";
import {
  StandalonePractice,
  checkPracticeAnswer,
  createCheckAndSaveAnswer,
  STANDALONE_CONTEXT_ID,
} from "~/features/lesson-practice";
import { useAccountSession } from "~/features/account";
import { usePracticeProgress } from "~/features/practice-progress";
import { Typography } from "~/shared/components/typography";
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
          <Typography.Title order={3} className={styles.catalogTitle}>
            {props.topicHeading ?? props.task.title}
          </Typography.Title>
          <PracticeTheory links={props.links} />
        </header>
      )}
      <StandalonePractice
        layout="compact"
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
          session.account
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
