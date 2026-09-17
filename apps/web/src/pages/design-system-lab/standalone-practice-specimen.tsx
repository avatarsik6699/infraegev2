import type { PracticeTaskTypes } from "~/entities/practice-task";
import { useState } from "react";
import {
  StandalonePractice,
  createLocalPracticeChecker,
} from "~/features/lesson-practice";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { practiceTasks } from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";

export const StandalonePracticeSpecimen: React.FC<{
  task?: PracticeTaskTypes.LocalTask;
  serviceFailure?: boolean;
}> = (props) => {
  const [accepted, setAccepted] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const [repeating, setRepeating] = useState(false);
  const task = props.task ?? {
    ...practiceTasks[0],
    id: "standalone-practice-specimen",
  };
  return (
    <section
      className={styles.widgetFlowSpecimen}
      aria-label="Самостоятельная практика"
    >
      <Typography.Title order={3}>Самостоятельная задача</Typography.Title>
      <Typography.Text tone="muted">
        Повторная попытка сохраняет прежний успех. Пример не меняет прогресс
        уроков.
      </Typography.Text>
      {accepted !== undefined && !repeating && (
        <Button
          hierarchy="quiet"
          onClick={() => {
            setRepeating(true);
            setAttempt((value) => value + 1);
          }}
        >
          Решить пример ещё раз
        </Button>
      )}
      <Typography.Title order={4}>{task.title}</Typography.Title>
      <StandalonePractice
        key={attempt}
        focusOnMount={repeating}
        tasks={[task]}
        acceptedAnswers={
          accepted !== undefined && !repeating ? { [task.id]: accepted } : {}
        }
        solvedTaskIds={accepted !== undefined && !repeating ? [task.id] : []}
        checkAnswer={
          props.serviceFailure
            ? () => Promise.reject(new Error("Lab service failure"))
            : createLocalPracticeChecker([task])
        }
        onTaskSolved={(_id, answer) => {
          setAccepted(answer);
          setRepeating(false);
          return 1;
        }}
      />
    </section>
  );
};
