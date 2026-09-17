import { useState } from "react";
import type {
  PracticeTaskTypes,
  PracticeCatalogTypes,
} from "~/entities/practice-task";
import {
  StandalonePractice,
  checkPracticeAnswer,
} from "~/features/lesson-practice";
import { usePracticeProgress } from "~/features/practice-progress";
import { Typography } from "~/shared/components/typography";
import { Button } from "~/shared/components/button";
import { PracticeContinuation } from "./practice-continuation";
import styles from "../practice-task-page.module.css";

export const PracticeSolving: React.FC<{
  task: PracticeTaskTypes.Task;
  onRefresh: () => Promise<unknown>;
  search: PracticeCatalogTypes.TaskSearch;
  catalogVisible: boolean;
}> = (props) => {
  const history = usePracticeProgress((state) => state.history[props.task.id]);
  const markSolved = usePracticeProgress((state) => state.markSolved);
  const hydrated = usePracticeProgress((state) => state.hydrated);
  const [attempt, setAttempt] = useState(0);
  const [repeating, setRepeating] = useState(false);
  const accepted = history?.[props.task.solutionRevision];
  const solved = accepted !== undefined;
  let status = "Прогресс сохраняется в этом браузере отдельно от уроков.";
  if (history && !solved)
    status = "Задача изменилась. Прежний успех сохранён; решите новую версию.";
  if (solved)
    status = repeating
      ? "Повторное решение. Прежний успех сохранён."
      : "Эта версия задачи решена.";
  return (
    <section className={styles.solving} aria-label="Решение задачи">
      <StandalonePractice
        key={`${props.task.solutionRevision}:${attempt}`}
        focusOnMount={repeating}
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
      <div className={styles.progress}>
        <Typography.Text tone="muted" variant="caption" role="status">
          {status}
        </Typography.Text>
        {hydrated && solved && !repeating && (
          <Button
            hierarchy="quiet"
            onClick={() => {
              setRepeating(true);
              setAttempt((value) => value + 1);
            }}
          >
            Решить ещё раз
          </Button>
        )}
      </div>
      {hydrated && solved && !repeating && props.catalogVisible && (
        <PracticeContinuation
          key={`${props.task.id}:${props.search.skill}:${props.search.exam_number}:${props.search.difficulty}`}
          id={props.task.id}
          search={props.search}
        />
      )}
    </section>
  );
};
