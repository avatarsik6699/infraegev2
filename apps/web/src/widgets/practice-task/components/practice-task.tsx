import { useState } from "react";
import {
  StandalonePractice,
  checkPracticeAnswer,
} from "~/features/lesson-practice";
import { usePracticeProgress } from "~/features/practice-progress";
import { Typography } from "~/shared/components/typography";
import { PracticeTheory } from "./practice-theory";
import type { PracticeTaskWidgetTypes } from "../practice-task.types";
import styles from "../practice-task.module.css";

export const PracticeTask: React.FC<PracticeTaskWidgetTypes.Props> = (
  props,
) => {
  const history = usePracticeProgress((state) => state.history[props.task.id]);
  const markSolved = usePracticeProgress((state) => state.markSolved);
  const hydrated = usePracticeProgress((state) => state.hydrated);
  const [attempt, setAttempt] = useState(0);
  const [repeating, setRepeating] = useState(false);
  const accepted = history?.[props.task.solutionRevision];
  const solved = accepted !== undefined;
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
        checkAnswer={checkPracticeAnswer}
        solvedTaskIds={solved && !repeating ? [props.task.id] : []}
        acceptedAnswers={
          solved && !repeating ? { [props.task.id]: accepted } : {}
        }
        onTaskSolved={(id, answer) => {
          markSolved(id, props.task.solutionRevision, answer);
          setRepeating(false);
          return 1;
        }}
        onRefresh={props.onRefresh}
      />
    </section>
  );
};
